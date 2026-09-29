from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from database.db import SessionLocal, create_tables
from routes import analytics, auth, buyers, extras, notifications, products, profile
from seed import seed_if_empty

app = FastAPI(
    title="Artisan AI API",
    description="Backend for the existing Artisan AI frontend (SIH 2026). Demo AI and pricing are transparent formulas, not trained models.",
    version="1.0.0",
)

origins = {
    settings.FRONTEND_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
}
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(buyers.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(extras.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    create_tables()
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()


@app.get("/")
def root():
    return {"app": "Artisan AI", "docs": "/docs", "api": "/api"}


@app.get("/api/health")
def health():
    return {"ok": True}
