from pathlib import Path

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from config import settings

Base = declarative_base()

ROOT_DIR = Path(__file__).resolve().parent.parent
SQLITE_URL = f"sqlite:///{(ROOT_DIR / 'artisan_ai.db').as_posix()}"

engine = None
using_sqlite = False


def _make_engine(url: str):
    kwargs = {"pool_pre_ping": True, "future": True}
    if url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
    return create_engine(url, **kwargs)


def init_engine():
    global engine, using_sqlite
    try:
        candidate = _make_engine(settings.DATABASE_URL)
        with candidate.connect() as conn:
            conn.execute(text("SELECT 1"))
        engine = candidate
        using_sqlite = False
        print(f"[artisan-ai] Connected to MySQL via {settings.DATABASE_URL.split('@')[-1]}")
    except Exception as exc:
        print(f"[artisan-ai] MySQL unavailable ({exc}). Falling back to SQLite at {SQLITE_URL}")
        engine = _make_engine(SQLITE_URL)
        using_sqlite = True
    return engine


init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    from models import buyer_request, notification, product, user  # noqa: F401

    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    print(f"[artisan-ai] Tables ready: {inspector.get_table_names()}")
