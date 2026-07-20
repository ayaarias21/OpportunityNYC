"""
Sync NYC Open Data datasets into MongoDB for OpportunityNYC.

Usage:
    python sync_datasets.py              # sync all configured datasets
    python sync_datasets.py --dataset snap_centers
    python sync_datasets.py --dataset jobs_nyc
    python sync_datasets.py --dry-run      # fetch and transform without writing
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime, timezone
from typing import Any

import requests
from pymongo import MongoClient, UpdateOne

from config import (
    DATASETS,
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


def parse_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


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
            timeout=60,
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
    borough = record.get("borough", infer_borough(street_address)).strip()

    address_parts = [part for part in [street_address, city, state, zip_code] if part]
    source_id = record.get("bin") or f"{facility_name}|{street_address}".lower()

    latitude = float(record["latitude"]) if record.get("latitude") else None
    longitude = float(record["longitude"]) if record.get("longitude") else None

    return {
        "title": facility_name,
        "type": "Food",
        "borough": borough,
        "description": record.get("comments") or "SNAP benefits center",
        "address": ", ".join(address_parts),
        "phone": None,
        "website": "https://www.nyc.gov/site/hra/help/snap-benefits-food-program.page",
        "postcode": zip_code or None,
        "hours": record.get("comments"),
        "latitude": latitude,
        "longitude": longitude,
        "sourceDataset": meta["source_dataset"],
        "sourceId": str(source_id),
        "sourceUrl": meta["source_url"],
        "lastSyncedAt": datetime.now(timezone.utc),
    }


def transform_job_posting(record: dict[str, Any], meta: dict[str, str]) -> dict[str, Any]:
    title = record.get("business_title") or record.get("civil_service_title") or "City Job Posting"
    agency = record.get("agency", "NYC Agency")
    work_location = record.get("work_location_1") or record.get("work_location") or ""
    borough = infer_borough(work_location)

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

    posting_date = parse_date(record.get("posting_date"))
    posting_updated = parse_date(record.get("posting_updated"))
    deadline = parse_date(record.get("post_until"))

    return {
        "title": title,
        "organization": agency,
        "category": "Job",
        "borough": borough,
        "description": description[:4000] if description else None,
        "link": f"https://cityjobs.nyc.gov/job/{record.get('job_id')}" if record.get("job_id") else None,
        "deadline": deadline,
        "agency": agency,
        "workLocation": work_location or None,
        "salaryRangeFrom": salary_from,
        "salaryRangeTo": salary_to,
        "salaryFrequency": salary_frequency,
        "salarySummary": " ".join(salary_parts) if salary_parts else None,
        "employmentType": employment_label,
        "jobCategory": record.get("job_category"),
        "postingDate": posting_date,
        "postingUpdated": posting_updated,
        "sourceDataset": meta["source_dataset"],
        "sourceId": str(record.get("job_id")),
        "sourceUrl": meta["source_url"],
        "lastSyncedAt": datetime.now(timezone.utc),
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
                "lastSyncedAt": datetime.now(timezone.utc),
                "status": "success",
            }
        },
        upsert=True,
    )


def sync_dataset(client: MongoClient, dataset_key: str, dry_run: bool) -> dict[str, Any]:
    meta = DATASETS[dataset_key]
    raw_records = fetch_dataset(meta["dataset_id"])

    if dataset_key == "snap_centers":
        transformed = [transform_snap_center(record, meta) for record in raw_records]
    elif dataset_key == "jobs_nyc":
        transformed = [transform_job_posting(record, meta) for record in raw_records]
    else:
        raise ValueError(f"Unsupported dataset: {dataset_key}")

    transformed = [record for record in transformed if record.get("sourceId")]

    collection = client.get_default_database()[meta["collection"]]
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
        update_sync_metadata(client.get_default_database(), dataset_key, meta, len(transformed), dry_run)

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

    print(f"Connecting to MongoDB: {re.sub(r'://([^:@/]+):([^@/]+)@', r'://\\1:***@', MONGO_URI)}")

    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        if not args.dry_run:
            client.admin.command("ping")
    except Exception as error:
        print(f"ERROR: Could not connect to MongoDB: {error}", file=sys.stderr)
        print("Set MONGO_URI in OpportunityNYC/.env before running the sync.", file=sys.stderr)
        return 1

    print("Starting NYC Open Data sync")
    if args.dry_run:
        print("Dry run enabled — no database writes will occur")

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
