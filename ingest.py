import os, uuid, glob, argparse, asyncio
import asyncpg
from dotenv import load_dotenv
from typing import List
import httpx

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PG_DSN = os.getenv("PG_DSN")
EMBED_MODEL = "text-embedding-3-large"

async def embed(texts: List[str]) -> List[List[float]]:
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            "https://api.openai.com/v1/embeddings",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={"input": texts, "model": EMBED_MODEL},
        )
    r.raise_for_status()
    data = r.json()
    return [d["embedding"] for d in data["data"]]

async def main(path: str, source: str):
    if not OPENAI_API_KEY:
        raise RuntimeError("Missing OPENAI_API_KEY")
    if not PG_DSN:
        raise RuntimeError("Missing PG_DSN")
    files = sorted(glob.glob(os.path.join(path, "**", "*.txt"), recursive=True))
    if not files:
        print("No .txt files found to ingest.")
        return

    texts = []
    titles = []
    for f in files:
        with open(f, "r", encoding="utf-8") as fh:
            texts.append(fh.read())
        titles.append(os.path.basename(f))

    vecs = await embed(texts)
    conn = await asyncpg.connect(PG_DSN)
    try:
        for title, content, v in zip(titles, texts, vecs):
            await conn.execute(
                "INSERT INTO documents(id,address,title,content,source,embedding) VALUES($1,$2,$3,$4,$5,$6)",
                uuid.uuid4(), None, title, content, source, v
            )
        print(f"Ingested {len(files)} files from {path}")
    finally:
        await conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", required=True, help="Directory of .txt files")
    parser.add_argument("--source", default="internal", help="Source label for references")
    args = parser.parse_args()
    asyncio.run(main(args.path, args.source))
    python app/ingest.py --path ../docs --source "internal"

