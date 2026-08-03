# Database Integration

OpportunityNYC stores live NYC Open Data in MongoDB and serves it through the Express API.

## Collections

| Collection | Purpose |
|------------|---------|
| `resources` | SNAP centers, benefits access centers, health enrollment sites, benefits programs, women's resources, Medicaid offices |
| `opportunities` | NYC job postings and SYEP program records |
| `sync_metadata` | Last sync time and record counts per dataset |

## Data flow

```text
NYC Open Data (SODA API)
        |
        v
scripts/sync_datasets.py
        |
        v
MongoDB Atlas (upsert by sourceDataset + sourceId)
        |
        v
Express API (/api/resources, /api/opportunities)
        |
        v
React frontend
```

## Syncing data

```bash
cd scripts
pip install -r requirements.txt
python sync_datasets.py
```

## API endpoints

- `GET /api/resources?category=&borough=&search=&limit=&page=`
- `GET /api/opportunities?category=&borough=&search=&limit=&page=`
- `GET /api/sync/status`

When `limit` or `page` is provided, responses include pagination metadata. Without those params, list endpoints return a flat array for backward compatibility.

## Connected datasets

1. [Jobs NYC Postings](https://data.cityofnewyork.us/City-Government/Jobs-NYC-Postings/kpav-sd4t)
2. [Directory of SNAP Centers](https://data.cityofnewyork.us/Social-Services/Directory-of-SNAP-Centers/tc6u-8rnp)
3. [Directory of Benefits Access Centers](https://data.cityofnewyork.us/Business/Directory-of-Benefits-Access-Centers/9d9t-bmk7)
4. [Health Insurance Enrollment](https://data.cityofnewyork.us/Health/Equitable-Health-Systems-Health-Insurance-Enrollme/gfej-by6h)
5. [NYC Benefits Platform](https://data.cityofnewyork.us/Social-Services/NYC-Benefits-Platform-Benefits-and-Programs-Datase/kvhd-5fmu)
6. [NYC Women's Resource Network](https://data.cityofnewyork.us/Social-Services/NYC-Women-s-Resource-Network-Database/pqg4-dm6b)
7. [Medicaid Offices](https://data.cityofnewyork.us/City-Government/Medicaid-Offices/ibs4-k445)
8. [SYEP for NYCHA Residents](https://data.cityofnewyork.us/City-Government/Summer-Youth-Employment-Program-SYEP-for-NYCHA-Res/73rz-5b7x)
