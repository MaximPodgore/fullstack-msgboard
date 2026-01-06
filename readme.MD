# Message Board full-stack website

A Vite+React frontend that allows the user to perform CRUD actions on comments.The backend DB + APIs are provided via containerized PostgreSQL and a Django webserver.



 ## Development

**Requirements:**
- Docker
- Npm

**Setup**
  
Spin up the docker containers (Postgres + backend)  
Migrations run automatically on backend start.
```powershell
docker compose up -d postgres backend
```
Then spin up the vite+react website
```powershell
cd frontend
npm install
npm run dev
```


## Architecture
The first 3 components are containerized for ease of use.
- Database: Postgres 16 on localhost:5432 (db: `msgboard`, user: `postgres`, password: `postgres`).
- Admin UI: Adminer on localhost:8080 (System: PostgreSQL, Server: `postgres`, Username: `postgres`, Password: `postgres`, Database: `msgboard`).
- Backend server: Django on localhost:8000
	- Container: `msgboard-backend` built from backend/Dockerfile
	- Root: `/` returns a simple health JSON; APIs under `/api/comments/`
	- Endpoints: list (`GET /api/comments/`), add (`POST /api/comments/add`), edit (`PUT/PATCH /api/comments/{id}/edit`), delete (`DELETE /api/comments/{id}/delete`)
	- Schema: managed via Django migrations (no SQL init script)
- Frontend website: Vite+React on localhost:5173


### Writeup

**Why *x***
- Chose Postgres + Django because it's part of Boybard's tech stack and I'm happy to learn.  
- Chose to use Docker containers for the backend because I figured that was cleaner and solved the environment friction mentioned in the writeup
- Chose Vite for the frontend because I wanted to use something "minimal" for react (more experience with Next.js but this made more sense)
- Chose the UI/UX direction by looking at Quora, Reddit, Hacker News and then just used Bobyard's accent color/theming for brownie points

I did use genAI for this project to quickly implement given the time limit. I made sure all architectural decisions were my own and that all my code is explainable (I am responsible for my code).  

The commits were spread out across 2 days and have time breaks between them but that's just because I had a lot going on and had to frequently context-switch. Howevever, I still only spent ~ 2 hours on the whole project

**Future todo:**
- Test endpoints more and maybe use redis for caching (if frequent loads are expected)
- Make the add endpoint use autoincrement instead of explicit id assignment
- Make image sizes standard (expandable on click)
- Reply and like handling (schema needs to be updated)
- Add user auth and disable CORS once I have it all sorted
- Make Bobyard favicon background transparent (lol)  
  
**Additional notes**
- Django now owns the `comments` schema via migrations (run `python backend/manage.py makemigrations` then `python backend/manage.py migrate`). The SQL init script no longer creates the table.
- Comment `id` uses Django `AutoField`. The current `add` endpoint explicitly assigns the next id