from __future__ import annotations

from collections.abc import Generator
from functools import lru_cache

from sqlmodel import Session, create_engine

from eroge_review_server.core.config import get_settings


@lru_cache(maxsize=1)
def get_engine():
    settings = get_settings()
    return create_engine(
        settings.sqlalchemy_database_url,
        echo=False,
    )


def get_session() -> Generator[Session, None, None]:
    engine = get_engine()
    with Session(engine) as session:
        yield session
