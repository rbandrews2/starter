-- Enable pgvector extension in your DB:
-- CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents(
  id uuid PRIMARY KEY,
  address text,
  title text,
  content text,
  source text,
  embedding vector(3072) -- text-embedding-3-large
);

-- Optional performance index (requires ANALYZE after load):
CREATE INDEX IF NOT EXISTS idx_docs_embedding
  ON documents USING ivfflat (embedding vector_cosine_ops);
