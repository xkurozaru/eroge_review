import uuid
from datetime import datetime

from sqlalchemy import CHAR, DateTime, func
from sqlmodel import Field, SQLModel


class IdTimestampsMixin(SQLModel):
    id: str = Field(
        default_factory=lambda: uuid.uuid7().hex,
        primary_key=True,
        nullable=False,
        sa_type=CHAR(32),
    )

    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={
            "server_default": func.now(),
        },
    )

    updated_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        nullable=False,
        sa_column_kwargs={
            "server_default": func.now(),
            "onupdate": func.now(),
        },
    )
