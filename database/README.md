# Database Integration

OpportunityNYC stores live NYC Open Data in MongoDB and serves it through the Express API.

## Collections

| Collection | Purpose | Source dataset |
|------------|---------|------------------|
| `resources` | Food assistance and community resources | [Directory of SNAP Centers](https://data.cityofnewyork.us/Social-Services/Directory-of-SNAP-Centers/tc6u-8rnp) |
| `opportunities` | Jobs, internships, scholarships, workshops | [Jobs NYC Postings](https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t) |
| `sync_metadata` | Last sync time and record counts per dataset | Written by Python sync script |

## Data flow

```text
NYC Open Data (SODA API)
        |
        v
scripts/sync_datasets.py
        |
        v
MongoDB (upsert by sourceDataset + sourceId)
        |
        v
Express API (/api/resources, /api/opportunities)
        |
        v
React frontend (Food page, Search page, Featured jobs)
```

## Syncing data

From the project root:

```bash
cd scripts
pip install -r requirements.txt
python sync_datasets.py
```

See `scripts/README.md` for scheduling and environment setup.

## API filtering

### Resources

`GET /api/resources?type=Food&borough=Bronx&q=SNAP&page=1&limit=50`

### Opportunities

`GET /api/opportunities?category=Job&q=health&borough=Brooklyn&page=1&limit=50`

### Sync status

`GET /api/sync/status`

## Schema notes

Imported records include:

- `sourceDataset`: human-readable dataset name
- `sourceId`: stable ID from NYC Open Data
- `sourceUrl`: dataset landing page
- `lastSyncedAt`: timestamp of the most recent sync

This lets repeated sync runs update existing records instead of creating duplicates.

## Local setup

1. Install MongoDB locally or create a free MongoDB Atlas cluster.
2. Copy `.env.example` to `.env` and set `MONGO_URI`.
3. Run the Python sync script.
4. Start the backend with `npm run dev` inside `backend/`.

The static CSV files in the parent `Datasets/` folder are reference exports only. The sync script pulls live data directly from NYC Open Data.
