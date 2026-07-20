# NYC Open Data Sync Scripts

Python scripts that keep OpportunityNYC datasets up to date by pulling live records from [NYC Open Data](https://data.cityofnewyork.us/) and upserting them into MongoDB.

## Supported datasets

| Dataset key | NYC Open Data source | MongoDB collection |
|-------------|----------------------|--------------------|
| `snap_centers` | [Directory of SNAP Centers](https://data.cityofnewyork.us/Social-Services/Directory-of-SNAP-Centers/tc6u-8rnp) | `resources` |
| `jobs_nyc` | [Jobs NYC Postings](https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t) | `opportunities` |

## Setup

1. Install dependencies:

```bash
cd scripts
pip install -r requirements.txt
```

2. Create `OpportunityNYC/.env` from `.env.example` and set `MONGO_URI`.

3. Run an initial sync:

```bash
python sync_datasets.py
```

## Commands

```bash
# Sync all configured datasets
python sync_datasets.py

# Sync one dataset
python sync_datasets.py --dataset snap_centers
python sync_datasets.py --dataset jobs_nyc

# Preview fetch/transform without writing to MongoDB
python sync_datasets.py --dry-run
```

## Scheduling live updates

Run the script on a schedule so the website stays current with NYC Open Data.

### Windows Task Scheduler

Create a daily task that runs:

```powershell
cd "C:\path\to\OpportunityNYC\scripts"
python sync_datasets.py
```

### Linux/macOS cron

```cron
0 6 * * * cd /path/to/OpportunityNYC/scripts && /usr/bin/python3 sync_datasets.py >> sync.log 2>&1
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `NYC_OPEN_DATA_APP_TOKEN` | Optional Socrata app token for higher API limits |
| `SYNC_PAGE_SIZE` | Records fetched per API page (default: 1000) |

## How sync works

1. Fetch paginated JSON from the NYC Open Data SODA API.
2. Transform each record into the OpportunityNYC MongoDB schema.
3. Upsert by `sourceDataset` + `sourceId` so repeated runs update existing records instead of duplicating them.
4. Remove stale records that no longer appear in the source dataset.
5. Store sync metadata in the `sync_metadata` collection.
