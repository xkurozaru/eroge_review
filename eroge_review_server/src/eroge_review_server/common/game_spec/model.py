import uuid
from datetime import date

from sqlalchemy import CHAR
from sqlmodel import Field, SQLModel


class GameSpecBase(SQLModel):
    title: str
    brand: str
    release_date: date


class GameSpec(GameSpecBase, table=True):
    __tablename__ = "game_spec"

    id: str = Field(
        default_factory=lambda: uuid.uuid7().hex,
        primary_key=True,
        nullable=False,
        sa_type=CHAR(32),
    )


class GameSpecCreate(GameSpecBase):
    pass


class GameSpecUpdate(GameSpecBase):
    pass


class GameSpecListResponse(SQLModel):
    items: list[GameSpec]
    total: int
    page: int
    page_size: int
