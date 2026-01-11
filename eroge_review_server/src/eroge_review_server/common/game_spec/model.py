from __future__ import annotations

from datetime import date

from sqlmodel import SQLModel

from eroge_review_server.common.utils.sqlmodel_mixins import IdTimestampsMixin


class GameSpecBase(SQLModel):
    title: str
    brand: str
    release_date: date


class GameSpec(GameSpecBase, IdTimestampsMixin, table=True):
    __tablename__ = "game_spec"


class GameSpecCreate(GameSpecBase):
    pass


class GameSpecUpdate(GameSpecBase):
    pass


class GameSpecListResponse(SQLModel):
    items: list[GameSpec]
    total: int
    page: int
    page_size: int
