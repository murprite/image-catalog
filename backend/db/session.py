from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
)
import os

MYSQL_PASS = os.getenv("MYSQL_PASS", "123456")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_HOST = os.getenv("MYSQL_USER", "localhost")

DB_URL = f"mysql+asyncmy://{MYSQL_USER}:{MYSQL_PASS}@{MYSQL_HOST}/gallery"

engine = create_async_engine(DB_URL)

async_session = async_sessionmaker(
    engine,
    expire_on_commit=False
)

async def get_db():
    async with async_session() as session:
        yield session