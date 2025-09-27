docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
docker exec -it pg psql -U postgres -c "CREATE DATABASE superiorai;"
docker exec -it pg psql -U postgres -d superiorai -c "CREATE EXTENSION IF NOT EXISTS vector;"
psql postgresql://postgres:postgres@localhost:5432/superiorai -f server/db.sql
