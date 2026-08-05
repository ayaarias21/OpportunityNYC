# NYC Open Data Sync Scripts

Python scripts that keep OpportunityNYC datasets up to date by pulling live records from [NYC Open Data](https://data.cityofnewyork.us/) and upserting them into MongoDB.

## Supported datasets

| Dataset key | NYC Open Data source | MongoDB collection |
|-------------|----------------------|--------------------|
| `snap_centers` | [Directory of SNAP Centers](https://data.cityofnewyork.us/Social-Services/Directory-of-SNAP-Centers/tc6u-8rnp) | `resources` |
| `jobs_nyc` | [Jobs NYC Postings](https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t) | `opportunities` |
| `benefits_access_centers` | [Directory of Benefits Access Centers](https://data.cityofnewyork.us/Business/Directory-of-Benefits-Access-Centers/9d9t-bmk7) | `resources` |
| `health_insurance_enrollment` | [Health Insurance Enrollment](https://data.cityofnewyork.us/Health/Equitable-Health-Systems-Health-Insurance-Enrollme/gfej-by6h) | `resources` |
| `benefits_programs` | [NYC Benefits Platform](https://data.cityofnewyork.us/Social-Services/NYC-Benefits-Platform-Benefits-and-Programs-Datase/kvhd-5fmu) | `resources` |
| `womens_resource_network` | [NYC Women's Resource Network](https://data.cityofnewyork.us/Social-Services/NYC-Women-s-Resource-Network-Database/pqg4-dm6b) | `resources` |
| `medicaid_offices` | [Medicaid Offices](https://data.cityofnewyork.us/City-Government/Medicaid-Offices/ibs4-k445) | `resources` |
| `syep_nycha` | [SYEP for NYCHA Residents](https://data.cityofnewyork.us/City-Government/Summer-Youth-Employment-Program-SYEP-for-NYCHA-Res/73rz-5b7x) | `opportunities` |

## Setup

```bash
cd scripts
pip install -r requirements.txt
```

Create `OpportunityNYC/.env`:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/OpportunityNYC?appName=Cluster0
MONGO_DB_NAME=OpportunityNYC
```

The database name is case-sensitive and must match Atlas exactly (`OpportunityNYC`).

## Commands

```bash
python sync_datasets.py
python sync_datasets.py --dataset medicaid_offices
python sync_datasets.py --dry-run
```

## Scheduling live updates

Run daily so data stays current with NYC Open Data.

**Windows Task Scheduler:**

```powershell
cd "C:\path\to\OpportunityNYC\scripts"
python sync_datasets.py
```

**cron (Linux/macOS):**

```cron
0 6 * * * cd /path/to/OpportunityNYC/scripts && python3 sync_datasets.py >> sync.log 2>&1
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (Atlas or local) |
| `MONGO_DB_NAME` | Database name (default: `OpportunityNYC`) |
| `NYC_OPEN_DATA_APP_TOKEN` | Optional Socrata app token for higher API limits |
| `SYNC_PAGE_SIZE` | Records fetched per API page (default: 1000) |
