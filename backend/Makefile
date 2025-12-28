.PHONY: help migrate-create migrate-up migrate-down migrate-history migrate-current migrate-reset run dev test clean

# Variables
VENV = home_care_env
PYTHON = $(VENV)/bin/python
ALEMBIC = $(VENV)/bin/alembic
UVICORN = $(VENV)/bin/uvicorn

help:
	@echo "Available commands:"
	@echo "  make migrate-create MSG='description'  - Create a new migration"
	@echo "  make migrate-up                        - Apply all pending migrations"
	@echo "  make migrate-down                      - Rollback last migration"
	@echo "  make migrate-history                   - Show migration history"
	@echo "  make migrate-current                   - Show current migration version"
	@echo "  make migrate-reset                     - Reset database (downgrade all, then upgrade)"
	@echo "  make run                               - Run the application"
	@echo "  make dev                               - Run the application in development mode"
	@echo "  make test                              - Run tests"
	@echo "  make clean                             - Clean Python cache files"

migrate-create:
	@if [ -z "$(MSG)" ]; then \
		echo "Error: MSG is required. Use: make migrate-create MSG='your message'"; \
		exit 1; \
	fi
	$(ALEMBIC) revision --autogenerate -m "$(MSG)"

migrate-up:
	$(ALEMBIC) upgrade head

migrate-down:
	$(ALEMBIC) downgrade -1

migrate-history:
	$(ALEMBIC) history

migrate-current:
	$(ALEMBIC) current

migrate-reset:
	$(ALEMBIC) downgrade base
	$(ALEMBIC) upgrade head

run:
	$(UVICORN) src.main:app --host 0.0.0.0 --port 8000

dev:
	$(UVICORN) src.main:app --host 0.0.0.0 --port 8000 --reload

test:
	$(PYTHON) -m pytest

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.coverage" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
