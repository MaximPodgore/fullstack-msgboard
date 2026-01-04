Data:
All comments are serialized and there are no examples of replies in the source.

Backend:

Current architecture:
The 3 following components are all containerized for ease of use.
- Database: Postgres 16 on localhost:5432 (db: `msgboard`, user: `postgres`, password: `postgres`).
- Admin UI: Adminer on localhost:8080 (System: PostgreSQL, Server: `postgres`, Username: `postgres`, Password: `postgres`, Database: `msgboard`).
- Backend server: Django on localhost:8000
	- Container: `msgboard-backend` built from backend/Dockerfile
	- Root: `/` returns a simple health JSON; APIs under `/api/comments/`
	- Endpoints: list (`GET /api/comments/`), add (`POST /api/comments/add`), edit (`PUT/PATCH /api/comments/{id}/edit`), delete (`DELETE /api/comments/{id}/delete`)
	- Schema: managed via Django migrations (no SQL init script)


Frontend:
Vite for simplicity or Next.js for familiarity
Tailwind for styling because I don't like working with vanilla css

---

Setup: Containerized PostgreSQL (Docker) + Import JSON

 

Spin up the docker containers (Postgres + backend)
```powershell
docker compose up -d postgres backend
```
Import data from comments.json:

```powershell
docker compose exec backend python scripts/import_comments.py
```

 Verify:

```powershell
docker exec -it msgboard-postgres psql -U postgres -d msgboard -c "SELECT COUNT(*) FROM public.comments;"
```

- Customize connection (optional): set `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` env vars before running the import script.



Internal API tests for current backend APIs

- List:
  
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/comments/" -Method Get | ConvertTo-Json -Depth 4
```

- Add:

```powershell
$body = @{ text = "Hello from Admin" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/comments/add" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 4
```

- Edit (replace `123` with the id you want to update):

```powershell
$edit = @{ text = "Updated text" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/comments/123/edit" -Method Put -ContentType "application/json" -Body $edit | ConvertTo-Json -Depth 4
```

- Delete (replace `123` with the id you want to delete):

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/comments/123/delete" -Method Delete | ConvertTo-Json -Depth 4
```

### Notes

- Django now owns the `comments` schema via migrations (run `python backend/manage.py makemigrations` then `python backend/manage.py migrate`). The SQL init script no longer creates the table.
- Comment `id` is auto-incremented via Postgres (AutoField).
- CSRF is currently disabled