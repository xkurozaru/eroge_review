from collections.abc import Generator

from sqlmodel import Session, create_engine

from eroge_review_server.core.config import settings

engine = create_engine(
    settings.sqlalchemy_database_url,
    echo=False,
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
