Data:
All comments are serialized and there are no examples of replies in the source.

Backend:
Going to use PostgreSQL for db, Django for backend API's
Haven't used PostgreSQL before but will use docker so it's containerized and easier to set up on diff devices

Current architecture:
- Database: Postgres 16 on localhost:5432 (db: `msgboard`, user: `postgres`, password: `postgres`).
- Admin UI: Adminer on localhost:8080 (System: PostgreSQL, Server: `postgres`, Username: `postgres`, Password: `postgres`, Database: `msgboard`).

Docker containerization. Conda for python environments

Frontend:
Vite for simplicity or Next.js for familiarity
Tailwind for styling because I don't like working with vanilla css

---

Setup: Containerized PostgreSQL (Docker) + Import JSON

Set up the python env:
```powershell
conda create -n msgBoard python=3.10
conda activate msgBoard
pip install -r requirements.txt
```

Spin up the docker container
```powershell
docker compose up -d
```
Schema: Auto-created on first run from sql/01_schema.sql with a `comments` table matching the JSON.

 Import data from comments.json:

```powershell
python scripts/import_comments.py
```

 Verify:

```powershell
docker exec -it msgboard-postgres psql -U postgres -d msgboard -c "SELECT COUNT(*) FROM public.comments;"
```

- Customize connection (optional): set `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` env vars before running the import script.