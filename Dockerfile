# Simple Docker build for the API
FROM python:3.11-slim

WORKDIR /app
COPY server/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY server /app
ENV PORT=10000
EXPOSE 10000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]
