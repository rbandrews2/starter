# Superior AI (Starter)

Fast, opinionated starter for adding an AI analyst to Superior Consultation LLC.
Includes:
- FastAPI service with `/ai/ask` and pgvector retrieval
- `ingest.py` to load your documents into `documents` table
- Minimal frontend widget to ask questions and show references
- Dockerfile + Render spec

## Quickstart (Local)
1) **Postgres with pgvector** (Docker example):
   ```bash
   docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
   docker exec -it pg psql -U postgres -c "CREATE DATABASE superiorai;"
   docker exec -it pg psql -U postgres -d superiorai -c "CREATE EXTENSION IF NOT EXISTS vector;"
   ```

2) **Create schema:**
   ```bash
   psql postgresql://postgres:postgres@localhost:5432/superiorai -f server/db.sql
   ```

3) **Python deps:**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

4) **Env:**
   ```bash
   cp .env.example .env
   # edit .env with your keys and PG_DSN
   ```

5) **Run API:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

6) **Ingest docs:**
   Put .txt files into `docs/` then:
   ```bash
   python app/ingest.py --path ../docs --source "internal"
   ```

7) **Test UI (static demo):**
   ```bash
   # from repo root
   python -m http.server 5500
   # open http://localhost:5500/frontend/index.html (it expects API at http://localhost:8000)
   ```

## Deploy (Render)
- Push this repo to GitHub.
- Create a Render **Web Service** from this repo.
- Environment: Python
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
- Add the env vars from `.env.example` (OPENAI_API_KEY, PG_DSN, etc.).

Alternatively, build with the included **Dockerfile**.

## Notes
- Embedding model dimension is set to 3072 (OpenAI `text-embedding-3-large`). Adjust if you change models.
- The AI answers use a cautious, citation-forward style. If context is missing, it says so.
- Extend `get_rentcast` and `get_crime_nearby` to call your real sources.
