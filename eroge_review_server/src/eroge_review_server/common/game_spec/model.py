import uuid
from typing import Optional

from sqlalchemy import CHAR
from sqlmodel import Field, SQLModel


class GameSpecBase(SQLModel):
    title: str
    brand: Optional[str] = None


class GameSpec(GameSpecBase, table=True):
    id: str = Field(
        default_factory=lambda: str(uuid.uuid7()),
        primary_key=True,
        nullable=False,
        sa_type=CHAR(36),
    )


class GameSpecCreate(GameSpecBase):
    pass
