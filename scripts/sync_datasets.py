"""
Sync NYC Open Data datasets into MongoDB for OpportunityNYC.

Usage:
    python sync_datasets.py
    python sync_datasets.py --dataset jobs_nyc
    python sync_datasets.py --dry-run
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime, timezone
from typing import Any, Callable

import requests
from pymongo import MongoClient, UpdateOne

from config import (
    DATASETS,
    MONGO_DB_NAME,
    MONGO_URI,
    NYC_OPEN_DATA_APP_TOKEN,
    NYC_OPEN_DATA_BASE,
    PAGE_SIZE,
)

BOROUGH_KEYWORDS = {
    "manhattan": "Manhattan",
    "bronx": "Bronx",
    "brooklyn": "Brooklyn",
    "queens": "Queens",
    "staten island": "Staten Island",
    "staten": "Staten Island",
}

VALID_BOROUGHS = set(BOROUGH_KEYWORDS.values()) | {"Citywide"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sync NYC Open Data into MongoDB")
    parser.add_argument(
        "--dataset",
        choices=list(DATASETS.keys()),
        help="Sync a single dataset instead of all configured datasets",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Fetch and transform records without writing to MongoDB",
    )
    return parser.parse_args()


def infer_borough(location: str | None) -> str:
    if not location:
        return "Citywide"

    normalized = location.lower()
    for keyword, borough in BOROUGH_KEYWORDS.items():
        if keyword in normalized:
            return borough
    return "Citywide"


def normalize_borough(value: str | None, location_fallback: str | None = None) -> str:
    if value and value.strip() in VALID_BOROUGHS:
        return value.strip()

    inferred = infer_borough(location_fallback or value)
    if inferred in VALID_BOROUGHS:
        return inferred

    return "Citywide"


def parse_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def sync_timestamp() -> datetime:
    return datetime.now(timezone.utc)


def base_provenance(meta: dict[str, str], source_id: str) -> dict[str, Any]:
    return {
        "sourceDataset": meta["source_dataset"],
        "sourceId": str(source_id),
        "sourceUrl": meta["source_url"],
        "lastSyncedAt": sync_timestamp(),
    }


def fetch_dataset(dataset_id: str) -> list[dict[str, Any]]:
    headers = {}
    if NYC_OPEN_DATA_APP_TOKEN:
        headers["X-App-Token"] = NYC_OPEN_DATA_APP_TOKEN

    records: list[dict[str, Any]] = []
    offset = 0

    while True:
        response = requests.get(
            f"{NYC_OPEN_DATA_BASE}/{dataset_id}.json",
            params={"$limit": PAGE_SIZE, "$offset": offset},
            headers=headers,
            timeout=120,
        )
        response.raise_for_status()
        batch = response.json()
        if not batch:
            break

        records.extend(batch)
        if len(batch) < PAGE_SIZE:
            break
        offset += PAGE_SIZE

    return records


def transform_snap_center(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    facility_name = record.get("facility_name", "").strip()
    street_address = record.get("street_address", "").strip()
    city = record.get("city", "New York").strip()
    state = record.get("state", "NY").strip()
    zip_code = record.get("zip_code", "").strip()
    borough = normalize_borough(record.get("borough"), street_address)
    address_parts = [part for part in [street_address, city, state, zip_code] if part]
    source_id = record.get("bin") or f"{facility_name}|{street_address}".lower()

    return {
        "title": facility_name,
        "organization": "NYC Human Resources Administration",
        "category": "Food Assistance",
        "borough": borough,
        "description": record.get("comments") or "SNAP benefits center",
        "link": "https://www.nyc.gov/site/hra/help/snap-benefits-food-program.page",
        "contact": None,
        "address": ", ".join(address_parts),
        "postcode": zip_code or None,
        "hours": record.get("comments"),
        "latitude": float(record["latitude"]) if record.get("latitude") else None,
        "longitude": float(record["longitude"]) if record.get("longitude") else None,
        **base_provenance(meta, source_id),
    }


def transform_job_posting(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    title = record.get("business_title") or record.get("civil_service_title") or "City Job Posting"
    agency = record.get("agency", "NYC Agency")
    work_location = record.get("work_location_1") or record.get("work_location") or ""
    borough = normalize_borough(None, work_location)

    salary_from = record.get("salary_range_from")
    salary_to = record.get("salary_range_to")
    salary_frequency = record.get("salary_frequency")

    salary_parts = []
    if salary_from and salary_to:
        salary_parts.append(f"${salary_from} - ${salary_to}")
    elif salary_from:
        salary_parts.append(f"From ${salary_from}")
    if salary_frequency:
        salary_parts.append(salary_frequency)

    employment_type = record.get("full_time_part_time_indicator")
    if employment_type == "F":
        employment_label = "Full-time"
    elif employment_type == "P":
        employment_label = "Part-time"
    else:
        employment_label = record.get("career_level") or "Job"

    description_sections = [
        record.get("job_description"),
        record.get("minimum_qual_requirements"),
        record.get("residency_requirement"),
    ]
    description = "\n\n".join(section for section in description_sections if section)

    return {
        "title": title,
        "organization": agency,
        "category": "Job",
        "borough": borough,
        "description": (description[:4000] if description else "NYC job posting"),
        "link": f"https://cityjobs.nyc.gov/job/{record.get('job_id')}" if record.get("job_id") else None,
        "deadline": parse_date(record.get("post_until")),
        "agency": agency,
        "workLocation": work_location or None,
        "salaryRangeFrom": salary_from,
        "salaryRangeTo": salary_to,
        "salaryFrequency": salary_frequency,
        "salarySummary": " ".join(salary_parts) if salary_parts else None,
        "employmentType": employment_label,
        "jobCategory": record.get("job_category"),
        "postingDate": parse_date(record.get("posting_date")),
        "postingUpdated": parse_date(record.get("posting_updated")),
        **base_provenance(meta, record.get("job_id")),
    }


def transform_benefits_access_center(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    facility_name = record.get("facility_name", "").strip()
    street_address = record.get("street_address", "").strip()
    city = record.get("city", "New York").strip()
    state = record.get("state", "NY").strip()
    zip_code = record.get("zip_code", "").strip()
    borough = normalize_borough(record.get("borough"), street_address)
    source_id = record.get("bin") or f"{facility_name}|{street_address}".lower()

    return {
        "title": facility_name,
        "organization": "NYC Human Resources Administration",
        "category": "Other",
        "borough": borough,
        "description": record.get("comments") or "Benefits access center",
        "link": "https://www.nyc.gov/site/hra/index.page",
        "contact": record.get("phone_number_s"),
        "address": ", ".join(part for part in [street_address, city, state, zip_code] if part),
        "postcode": zip_code or None,
        "hours": record.get("comments"),
        "latitude": float(record["latitude"]) if record.get("latitude") else None,
        "longitude": float(record["longitude"]) if record.get("longitude") else None,
        **base_provenance(meta, source_id),
    }


def transform_health_insurance_enrollment(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    health_center = record.get("health_center", "").strip()
    street_address = record.get("street_address", "").strip()
    zip_code = record.get("zip_code", "").strip()
    borough = normalize_borough(record.get("borough"), street_address)
    source_id = record.get("bin") or f"{health_center}|{street_address}".lower()

    hours = record.get("hours_of_operation")
    days = record.get("days_of_operation")
    hours_text = ", ".join(part for part in [days, hours] if part)

    description_parts = [
        record.get("accept_walk_ins"),
        f"Languages: {record.get('languages_other_than_english')}" if record.get("languages_other_than_english") else None,
    ]

    return {
        "title": health_center,
        "organization": "NYC Department of Health and Mental Hygiene",
        "category": "Healthcare",
        "borough": borough,
        "description": ". ".join(part for part in description_parts if part) or "Health insurance enrollment site",
        "link": record.get("website") if record.get("website", "").startswith("http") else "https://www.nyc.gov/health",
        "contact": record.get("telephone_number"),
        "address": ", ".join(part for part in [street_address, "New York", "NY", zip_code] if part),
        "postcode": zip_code or None,
        "hours": hours_text or None,
        "latitude": float(record["latitude"]) if record.get("latitude") else None,
        "longitude": float(record["longitude"]) if record.get("longitude") else None,
        **base_provenance(meta, source_id),
    }


def transform_benefits_program(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    program_name = record.get("plain_language_program_name") or record.get("program_name") or "NYC Benefits Program"
    source_id = record.get("unique_id_number") or record.get("program_code")
    description = record.get("brief_excerpt") or record.get("program_description") or "NYC benefits program"

    link = record.get("url_of_online_application")
    if link and not link.startswith("http"):
        link = None

    return {
        "title": program_name.strip(),
        "organization": record.get("government_agency") or "NYC Benefits Platform",
        "category": "Other",
        "borough": "Citywide",
        "description": description.strip()[:4000],
        "link": link,
        "contact": record.get("get_help_by_calling_311") or record.get("get_help_by_calling_other_than_311"),
        "address": None,
        "postcode": None,
        "hours": None,
        "latitude": None,
        "longitude": None,
        **base_provenance(meta, source_id),
    }


def borough_from_flags(record: dict[str, Any]) -> str:
    flag_map = [
        ("bronx", "Bronx"),
        ("brooklyn", "Brooklyn"),
        ("manhattan", "Manhattan"),
        ("queens", "Queens"),
        ("staten_island", "Staten Island"),
    ]

    for field, borough in flag_map:
        if str(record.get(field, "")).upper() == "Y":
            return borough

    return normalize_borough(record.get("city"), record.get("address1"))


def resource_category_from_flags(record: dict[str, Any]) -> str:
    if str(record.get("health", "")).upper() == "Y":
        return "Healthcare"
    if str(record.get("housing", "")).upper() == "Y":
        return "Housing"
    if str(record.get("education", "")).upper() == "Y":
        return "Student Support"
    if str(record.get("employment_job_training", "")).upper() == "Y":
        return "Workshop"
    return "Other"


def transform_womens_resource(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    organization = record.get("organizationname", "").strip()
    address = record.get("address1", "").strip()
    city = record.get("city", "").strip()
    source_id = f"{organization}|{address}|{city}".lower()

    phone = record.get("phone")
    fax = record.get("fax")
    contact_parts = []
    if phone:
        contact_parts.append(f"Phone: {phone}")
    if fax:
        contact_parts.append(f"Fax: {fax}")

    return {
        "title": organization,
        "organization": organization,
        "category": resource_category_from_flags(record),
        "borough": borough_from_flags(record),
        "description": record.get("description") or "Women's resource network organization",
        "link": record.get("url") if record.get("url", "").startswith("http") else None,
        "contact": " | ".join(contact_parts) if contact_parts else None,
        "address": ", ".join(part for part in [address, city, "NY"] if part),
        "postcode": None,
        "hours": None,
        "latitude": None,
        "longitude": None,
        **base_provenance(meta, source_id),
    }


def transform_medicaid_office(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    office_name = record.get("name_of_medicaid_office", "").strip()
    street_address = record.get("office_address", "").strip()
    city = record.get("city", "New York").strip()
    state = record.get("state", "NY").strip()
    zip_code = record.get("postcode", "").strip()
    borough = normalize_borough(record.get("name_of_borough"), street_address)
    source_id = record.get("bin") or f"{office_name}|{street_address}".lower()

    return {
        "title": office_name,
        "organization": "NYC Human Resources Administration",
        "category": "Healthcare",
        "borough": borough,
        "description": record.get("comments") or "Medicaid office",
        "link": "https://www.nyc.gov/site/hra/medicaid/medicaid.page",
        "contact": record.get("phone_number"),
        "address": ", ".join(part for part in [street_address, city, state, zip_code] if part),
        "postcode": zip_code or None,
        "hours": record.get("comments"),
        "latitude": float(record["latitude"]) if record.get("latitude") else None,
        "longitude": float(record["longitude"]) if record.get("longitude") else None,
        **base_provenance(meta, source_id),
    }


def transform_syep_nycha(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    year = record.get("year", "Unknown")
    district = record.get("council_district", "Unknown")
    source_id = f"{year}|{district}"

    description = (
        f"Applied: {record.get('applied_for_the_program', 'N/A')}. "
        f"Accepted and enrolled: {record.get('were_accepted_and_enrolled', 'N/A')}. "
        f"Average wage: {record.get('average_wage_of_residents', 'N/A')}. "
        f"Received social referral: {record.get('received_a_referral_for_social', 'N/A')}. "
        f"Enrolled in financial literacy: {record.get('enrolled_in_financial', 'N/A')}. "
        f"Enrolled in college readiness: {record.get('enrolled_in_college_readiness', 'N/A')}."
    )

    return {
        "title": f"SYEP for NYCHA Residents - Council District {district} ({year})",
        "organization": "NYC Department of Youth and Community Development",
        "category": "Internship",
        "borough": "Citywide",
        "description": description,
        "link": "https://www.nyc.gov/site/dycd/services/jobs-internships/summer-youth-employment-program-syep.page",
        "deadline": None,
        "agency": "NYC Department of Youth and Community Development",
        "workLocation": f"Council District {district}",
        "salaryRangeFrom": None,
        "salaryRangeTo": None,
        "salaryFrequency": None,
        "salarySummary": record.get("average_wage_of_residents"),
        "employmentType": "Summer Program",
        "jobCategory": "Youth Employment",
        "postingDate": parse_date(f"{year}-01-01T00:00:00.000"),
        "postingUpdated": sync_timestamp(),
        **base_provenance(meta, source_id),
    }


TRANSFORMERS: dict[str, Callable[[dict[str, Any], dict[str, str]], dict[str, Any]]] = {
    "snap_center": transform_snap_center,
    "job_posting": transform_job_posting,
    "benefits_access_center": transform_benefits_access_center,
    "health_insurance_enrollment": transform_health_insurance_enrollment,
    "benefits_program": transform_benefits_program,
    "womens_resource": transform_womens_resource,
    "medicaid_office": transform_medicaid_office,
    "syep_nycha": transform_syep_nycha,
}


def upsert_records(
    collection,
    records: list[dict[str, Any]],
    source_dataset: str,
    dry_run: bool,
) -> tuple[int, int]:
    if dry_run:
        return len(records), 0

    operations = [
        UpdateOne(
            {"sourceDataset": source_dataset, "sourceId": record["sourceId"]},
            {"$set": record},
            upsert=True,
        )
        for record in records
    ]

    if not operations:
        return 0, 0

    result = collection.bulk_write(operations, ordered=False)
    synced = result.upserted_count + result.modified_count
    return synced, result.matched_count


def remove_stale_records(collection, source_dataset: str, active_source_ids: set[str], dry_run: bool) -> int:
    if dry_run or not active_source_ids:
        return 0

    stale_query = {
        "sourceDataset": source_dataset,
        "sourceId": {"$nin": list(active_source_ids)},
    }
    delete_result = collection.delete_many(stale_query)
    return delete_result.deleted_count


def update_sync_metadata(db, dataset_key: str, meta: dict[str, str], record_count: int, dry_run: bool) -> None:
    if dry_run:
        return

    db.sync_metadata.update_one(
        {"datasetKey": dataset_key},
        {
            "$set": {
                "datasetKey": dataset_key,
                "sourceDataset": meta["source_dataset"],
                "sourceUrl": meta["source_url"],
                "collection": meta["collection"],
                "recordCount": record_count,
                "lastSyncedAt": sync_timestamp(),
                "status": "success",
            }
        },
        upsert=True,
    )


def sync_dataset(client: MongoClient, dataset_key: str, dry_run: bool) -> dict[str, Any]:
    meta = DATASETS[dataset_key]
    raw_records = fetch_dataset(meta["dataset_id"])
    transformer = TRANSFORMERS[meta["transformer"]]
    transformed = [transformer(record, meta) for record in raw_records]
    transformed = [record for record in transformed if record.get("sourceId")]

    db = client[MONGO_DB_NAME]
    collection = db[meta["collection"]]
    synced_count, matched_count = upsert_records(
        collection,
        transformed,
        meta["source_dataset"],
        dry_run,
    )

    active_source_ids = {record["sourceId"] for record in transformed}
    removed_count = remove_stale_records(
        collection,
        meta["source_dataset"],
        active_source_ids,
        dry_run,
    )

    if not dry_run:
        update_sync_metadata(db, dataset_key, meta, len(transformed), dry_run)

    return {
        "dataset": dataset_key,
        "fetched": len(raw_records),
        "transformed": len(transformed),
        "synced": synced_count,
        "matched": matched_count,
        "removed_stale": removed_count,
    }


def main() -> int:
    args = parse_args()
    dataset_keys = [args.dataset] if args.dataset else list(DATASETS.keys())

    masked_uri = re.sub(r"://([^:@/]+):([^@/]+)@", r"://\1:***@", MONGO_URI)
    print(f"Connecting to MongoDB: {masked_uri}")
    print(f"Database: {MONGO_DB_NAME}")

    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
        if not args.dry_run:
            client.admin.command("ping")
    except Exception as error:
        print(f"ERROR: Could not connect to MongoDB: {error}", file=sys.stderr)
        print("Set MONGO_URI in OpportunityNYC/.env before running the sync.", file=sys.stderr)
        return 1

    print("Starting NYC Open Data sync")
    if args.dry_run:
        print("Dry run enabled - no database writes will occur")

    for dataset_key in dataset_keys:
        print(f"\nSyncing {dataset_key}...")
        try:
            summary = sync_dataset(client, dataset_key, args.dry_run)
            print(
                f"  fetched={summary['fetched']} transformed={summary['transformed']} "
                f"synced={summary['synced']} removed_stale={summary['removed_stale']}"
            )
        except requests.RequestException as error:
            print(f"  ERROR fetching dataset: {error}", file=sys.stderr)
            return 1
        except Exception as error:
            print(f"  ERROR syncing dataset: {error}", file=sys.stderr)
            return 1

    print("\nSync complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
