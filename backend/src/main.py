import sys
from pathlib import Path

# ✅ Add backend directory to Python path FIRST (before any src imports)
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# ✅ Now import from src
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.core.config import settings

# Import all feature routers
from src.features.accounts.router import router as accounts_router
from src.features.client_contacts.router import router as client_contacts_router
from src.features.appointments.router import router as appointments_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting up...")
    print("✅ Database connection ready (migrations managed by Alembic)")
    yield
    # Shutdown
    print("🛑 Shutting down...")

app = FastAPI(
    title="Healthcare API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(accounts_router, prefix="/api/v1")
app.include_router(client_contacts_router, prefix="/api/v1")
app.include_router(appointments_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Healthcare API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add this at the bottom to run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )