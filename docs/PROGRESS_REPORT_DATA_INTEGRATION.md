# Progress Report: Data Integration & Live Dataset Sync

**Project:** OpportunityNYC  
**Team member:** Karim  
**Report type:** Second / Final Progress Report (Data Integration Workstream)  
**Date:** July 20, 2026

---

## 1. Role and Scope

My responsibility on OpportunityNYC is to connect external NYC datasets to our platform so users can browse them through one website, and to keep those datasets updated using a Python sync pipeline.

Initial target datasets:

1. [Jobs NYC Postings](https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t/about_data)
2. [Directory of SNAP Centers](https://data.cityofnewyork.us/Social-Services/Directory-of-SNAP-Centers/tc6u-8rnp/about_data)

Previously, a static SNAP Centers CSV existed in the local `Datasets/` folder but was not connected to the application and was not being refreshed. The live NYC Open Data endpoints are now the source of truth.

---

## 2. Work Completed This Period

### 2.1 Python live sync pipeline

Built a reusable sync system in `OpportunityNYC/scripts/`:

- `sync_datasets.py` — fetches paginated JSON from the NYC Open Data SODA API, transforms records into our MongoDB schema, upserts them, removes stale records, and records sync metadata
- `config.py` — central dataset configuration and environment loading
- `requirements.txt` — Python dependencies (`requests`, `pymongo`, `python-dotenv`)
- `README.md` — setup, usage, and scheduling instructions

Features implemented:

- Supports both configured datasets (`snap_centers`, `jobs_nyc`)
- Upserts by `sourceDataset` + `sourceId` to prevent duplicates on repeated runs
- Deletes records removed from the upstream dataset
- Stores sync history in a `sync_metadata` collection
- Supports `--dataset` and `--dry-run` flags for testing

### 2.2 Database schema updates

Extended Mongoose models to support imported public data:

**Resources (`backend/models/Resource.js`)**

- Added `postcode`, `hours`, `latitude`, `longitude`
- Added provenance fields: `sourceDataset`, `sourceId`, `sourceUrl`, `lastSyncedAt`
- Added indexes for filtering and text search

**Opportunities (`backend/models/Opportunity.js`)**

- Added job-specific fields: `agency`, `workLocation`, salary fields, `employmentType`, `jobCategory`, `postingDate`, `postingUpdated`
- Added the same provenance/sync fields as resources
- Added indexes for category, borough, and text search

### 2.3 Backend API enhancements

Updated controllers to expose live synced data with filtering and pagination:

- `GET /api/resources?type=&borough=&q=&page=&limit=`
- `GET /api/opportunities?category=&borough=&q=&page=&limit=`
- `GET /api/sync/status` — returns collection counts and last sync metadata

Responses now return:

```json
{
  "data": [...],
  "pagination": { "page": 1, "limit": 50, "total": 120, "totalPages": 3 }
}
```

### 2.4 Frontend integration

Connected the React frontend to the backend API:

- Added `frontend/src/lib/api.js` as a shared API client
- Wired `/food` page to live SNAP center listings from `/api/resources`
- Wired `/search` page to live NYC job postings from `/api/opportunities`
- Updated homepage featured jobs to load from the API instead of hardcoded mock data
- Added `/food` route in `App.jsx`
- Linked homepage “I want to…” cards to real routes
- Added Vite dev proxy for `/api`

Users can now browse synced SNAP centers and NYC job postings through the website once MongoDB is populated and the backend is running.

### 2.5 Documentation and environment setup

Added:

- `.env.example` files for root, backend, and frontend
- Updated `database/README.md` with architecture and API usage
- Updated `scripts/README.md` with sync and scheduling instructions

---

## 3. Current System Architecture

```text
NYC Open Data
  ├── Jobs NYC Postings (kpav-sd4t)
  └── Directory of SNAP Centers (tc6u-8rnp)
              |
              v
     Python sync_datasets.py
              |
              v
          MongoDB
    ├── opportunities
    ├── resources
    └── sync_metadata
              |
              v
       Express REST API
              |
              v
        React frontend
   ├── Homepage featured jobs
   ├── /search job listings
   └── /food SNAP centers
```

---

## 4. Demonstration Status

| Feature | Status |
|---------|--------|
| Fetch live data from NYC Open Data | Complete |
| Transform into OpportunityNYC schema | Complete |
| Upsert into MongoDB | Complete |
| Remove stale records | Complete |
| API filtering/search/pagination | Complete |
| Frontend consumption of live data | Complete |
| Automated scheduled sync in production | Not yet deployed |
| Additional datasets beyond the first two | Not started |

---

## 5. Remaining Work

The core integration path is in place, but the following items remain before this workstream is fully complete:

1. **Production MongoDB setup**
   - Configure a shared MongoDB Atlas cluster for the team
   - Document connection setup for all developers

2. **Automated scheduling**
   - Deploy daily sync via Windows Task Scheduler, cron, or GitHub Actions
   - Add failure notifications/logging

3. **Additional datasets**
   - Housing resources
   - Food pantries beyond SNAP centers
   - Internships, scholarships, and workshops from additional NYC Open Data sources

4. **Search improvements**
   - Borough filter UI on frontend search pages
   - Better relevance ranking for large job result sets
   - Optional map view for SNAP centers using latitude/longitude

5. **Operational hardening**
   - Optional NYC Open Data app token for higher API limits
   - Sync retry/error reporting
   - Backend validation for manually added records vs imported records

6. **Team integration**
   - Coordinate with frontend teammates on unified navigation and page styling
   - Confirm deployment environment variables for production hosting

---

## 6. How to Run (For Demo / Team Testing)

1. Copy `.env.example` to `.env` and set `MONGO_URI`
2. Install Python dependencies:

```bash
cd OpportunityNYC/scripts
pip install -r requirements.txt
```

3. Run initial sync:

```bash
python sync_datasets.py
```

4. Start backend:

```bash
cd OpportunityNYC/backend
npm install
npm run dev
```

5. Start frontend:

```bash
cd OpportunityNYC/frontend
npm install
npm run dev
```

6. Visit:
   - `http://localhost:5173/food` for SNAP centers
   - `http://localhost:5173/search?category=Job` for NYC jobs

---

## 7. Summary

This progress period moved the data integration workstream from planning and static CSV files to a working end-to-end pipeline. NYC Open Data can now be synced into MongoDB through Python, served through our Express API, and displayed on the OpportunityNYC website.

The most important remaining tasks are production deployment of the sync schedule, adding more datasets, and refining search/filter UX for larger result sets. The foundation is complete and ready for the final project phase.

---

## 8. Sources

- [Jobs NYC Postings | NYC Open Data](https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t/about_data)
- [Directory of SNAP Centers | NYC Open Data](https://data.cityofnewyork.us/Social-Services/Directory-of-SNAP-Centers/tc6u-8rnp/about_data)
