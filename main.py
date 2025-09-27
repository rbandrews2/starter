import os, json, uuid, asyncio
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
import asyncpg
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
RENTCAST_API_KEY = os.getenv("RENTCAST_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
CORS = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
PG_DSN = os.getenv("PG_DSN")

app = FastAPI(title="superior-ai")
app.add_middleware(CORSMiddleware,
    allow_origins=CORS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Pydantic models
class AskPayload(BaseModel):
    query: str
    address: Optional[str] = None
    k: int = 8

class AiAnswer(BaseModel):
    answer: str
    references: List[str] = Field(default_factory=list)
    data: dict = Field(default_factory=dict)

# --------- Helpers
async def pg():
    if not PG_DSN:
        raise HTTPException(500, "Missing PG_DSN")
    return await asyncpg.connect(PG_DSN)

EMBED_MODEL = "text-embedding-3-large"
CHAT_MODEL = "gpt-4.1-mini"

async def embed(texts: List[str]) -> List[List[float]]:
    if not OPENAI_API_KEY:
        raise HTTPException(500, "Missing OPENAI_API_KEY")
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            "https://api.openai.com/v1/embeddings",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={"input": texts, "model": EMBED_MODEL},
        )
    r.raise_for_status()
    data = r.json()
    return [d["embedding"] for d in data["data"]]

async def chat(messages: List[dict]) -> str:
    if not OPENAI_API_KEY:
        raise HTTPException(500, "Missing OPENAI_API_KEY")
    async with httpx.AsyncClient(timeout=120) as client:
        r = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": CHAT_MODEL,
                "messages": messages,
                "temperature": 0.2,
            },
        )
    r.raise_for_status()
    j = r.json()
    return j["choices"][0]["message"]["content"]

# ----- External data fetchers (replace with real integrations)
async def get_rentcast(address: str) -> dict:
    # TODO: Call your actual RentCast or internal API
    if not address:
        return {}
    return {"rentcast": {"address": address, "note": "stubbed – wire real data"}}

async def get_crime_nearby(address: str) -> dict:
    # TODO: Call your actual crime data source
    if not address:
        return {}
    return {"crime": {"address": address, "incidents_12mo": None, "note": "stubbed"}}

# ----- Retrieval (pgvector table)
# Table schema in server/db.sql
async def retrieve_similar(q_embed: List[float], k: int):
    conn = await pg()
    rows = await conn.fetch(
        "SELECT id, title, content, source FROM documents ORDER BY embedding <=> $1 LIMIT $2",
        q_embed, k
    )
    await conn.close()
    return [dict(r) for r in rows]

# ----- Routes
@app.get("/")
def root():
    return {"message": "Superior AI online"}

@app.post("/ai/ask", response_model=AiAnswer)
async def ai_ask(payload: AskPayload):
    # 1) Embed query
    [q_vec] = await embed([payload.query])

    # 2) Retrieve context
    docs = await retrieve_similar(q_vec, payload.k)
    ctx = "\n\n".join([f"[{d['title']}] {d['content']}" for d in docs])

    # 3) Optional live data
    rentcast_task = asyncio.create_task(get_rentcast(payload.address or ""))
    crime_task = asyncio.create_task(get_crime_nearby(payload.address or ""))

    # 4) System/user prompt
    sys = (
      "You are Superior AI, a cautious property analyst. "
      "Use ONLY the provided context and data. If data is missing, say what's missing. "
      "Return concise, factual answers with short references."
    )
    user = f"Question: {payload.query}\n\nContext:\n{ctx[:12000]}"
    if payload.address:
        user += f"\n\nFocus address: {payload.address}"

    # 5) Model call
    answer_text = await chat([{"role":"system","content":sys},{"role":"user","content":user}])

    # 6) Gather live data
    live = {}
    live.update(await rentcast_task)
    live.update(await crime_task)

    refs = [d["source"] for d in docs if d.get("source")]
    # de-dupe while preserving order
    seen = set()
    refs = [x for x in refs if not (x in seen or seen.add(x))]

    return AiAnswer(answer=answer_text, references=refs, data=live)

cd server
pip install -r requirements.txt
cp .env.example .env   # fill OPENAI_API_KEY + PG_DSN
