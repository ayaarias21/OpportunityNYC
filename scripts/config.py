"""Configuration for NYC Open Data sync scripts."""

import os
from pathlib import Path

from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(SCRIPT_DIR / ".env")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/OpportunityNYC").strip()
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "OpportunityNYC").strip()
NYC_OPEN_DATA_APP_TOKEN = os.getenv("NYC_OPEN_DATA_APP_TOKEN", "")

NYC_OPEN_DATA_BASE = "https://data.cityofnewyork.us/resource"
PAGE_SIZE = int(os.getenv("SYNC_PAGE_SIZE", "1000"))

DATASETS = {
    "snap_centers": {
        "dataset_id": "tc6u-8rnp",
        "collection": "resources",
        "source_dataset": "Directory of SNAP Centers",
        "source_url": "https://data.cityofnewyork.us/Social-Services/Directory-of-SNAP-Centers/tc6u-8rnp",
        "transformer": "snap_center",
    },
    "jobs_nyc": {
        "dataset_id": "kpav-sd4t",
        "collection": "opportunities",
        "source_dataset": "Jobs NYC Postings",
        "source_url": "https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t",
        "transformer": "job_posting",
    },
    "benefits_access_centers": {
        "dataset_id": "9d9t-bmk7",
        "collection": "resources",
        "source_dataset": "Directory of Benefits Access Centers",
        "source_url": "https://data.cityofnewyork.us/Business/Directory-of-Benefits-Access-Centers/9d9t-bmk7",
        "transformer": "benefits_access_center",
    },
    "health_insurance_enrollment": {
        "dataset_id": "gfej-by6h",
        "collection": "resources",
        "source_dataset": "Equitable Health Systems - Health Insurance Enrollment",
        "source_url": "https://data.cityofnewyork.us/Health/Equitable-Health-Systems-Health-Insurance-Enrollme/gfej-by6h",
        "transformer": "health_insurance_enrollment",
    },
    "benefits_programs": {
        "dataset_id": "kvhd-5fmu",
        "collection": "resources",
        "source_dataset": "NYC Benefits Platform: Benefits and Programs Dataset",
        "source_url": "https://data.cityofnewyork.us/Social-Services/NYC-Benefits-Platform-Benefits-and-Programs-Datase/kvhd-5fmu",
        "transformer": "benefits_program",
    },
    "womens_resource_network": {
        "dataset_id": "pqg4-dm6b",
        "collection": "resources",
        "source_dataset": "NYC Women's Resource Network Database",
        "source_url": "https://data.cityofnewyork.us/Social-Services/NYC-Women-s-Resource-Network-Database/pqg4-dm6b",
        "transformer": "womens_resource",
    },
    "medicaid_offices": {
        "dataset_id": "ibs4-k445",
        "collection": "resources",
        "source_dataset": "Medicaid Offices",
        "source_url": "https://data.cityofnewyork.us/City-Government/Medicaid-Offices/ibs4-k445",
        "transformer": "medicaid_office",
    },
    "syep_nycha": {
        "dataset_id": "73rz-5b7x",
        "collection": "opportunities",
        "source_dataset": "Summer Youth Employment Program (SYEP) for NYCHA Residents",
        "source_url": "https://data.cityofnewyork.us/City-Government/Summer-Youth-Employment-Program-SYEP-for-NYCHA-Res/73rz-5b7x",
        "transformer": "syep_nycha",
    },
}
