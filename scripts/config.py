"""Configuration for NYC Open Data sync scripts."""

import os
from pathlib import Path

from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(SCRIPT_DIR / ".env")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/opportunitynyc")
NYC_OPEN_DATA_APP_TOKEN = os.getenv("NYC_OPEN_DATA_APP_TOKEN", "")

NYC_OPEN_DATA_BASE = "https://data.cityofnewyork.us/resource"
PAGE_SIZE = int(os.getenv("SYNC_PAGE_SIZE", "1000"))

DATASETS = {
    "snap_centers": {
        "dataset_id": "tc6u-8rnp",
        "collection": "resources",
        "source_dataset": "Directory of SNAP Centers",
        "source_url": "https://data.cityofnewyork.us/Social-Services/Directory-of-SNAP-Centers/tc6u-8rnp",
    },
    "jobs_nyc": {
        "dataset_id": "kpav-sd4t",
        "collection": "opportunities",
        "source_dataset": "Jobs NYC Postings",
        "source_url": "https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t",
    },
}
