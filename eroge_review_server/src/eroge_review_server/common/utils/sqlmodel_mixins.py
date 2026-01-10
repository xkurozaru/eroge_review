from datetime import datetime, timezone

from sqlalchemy import CHAR, DateTime, func
from sqlmodel import Field, SQLModel
from uuid6 import uuid7


class IdTimestampsMixin(SQLModel):
    id: str = Field(
        default_factory=lambda: uuid7().hex,
        primary_key=True,
        nullable=False,
        sa_type=CHAR(32),
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={
            "server_default": func.now(),
        },
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={
            "server_default": func.now(),
            "onupdate": func.now(),
        },
    )
