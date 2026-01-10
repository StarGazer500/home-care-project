#!/bin/bash
set -e

# Activate the virtual environment
source /app/envname/bin/activate

export PYTHONPATH=/app/backend/src:$PYTHONPATH



# Wait for the database to be ready
# Use DB_PORT (6432) instead of POSTGRES_PORT (5433)
echo "Waiting for database at ${DB_HOST}:${DB_PORT}..."

until pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}"; do
  echo "Waiting for database at ${DB_HOST}:${DB_PORT}..."
  sleep 2
done

echo "Database is ready!"

uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

