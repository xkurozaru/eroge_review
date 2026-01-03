from __future__ import annotations

from datetime import date, datetime
from enum import Enum

from sqlalchemy import CHAR, UniqueConstraint
from sqlmodel import Field, SQLModel

from eroge_review_server.common.game_review.exception import GameReviewPublishValidationError
from eroge_review_server.common.utils.sqlmodel_mixins import IdTimestampsMixin


class GameReviewStatus(str, Enum):
    unreviewed = "unreviewed"  # game_review does not exist
    published = "published"  # game_review exists and is_published = true
    draft = "draft"  # game_review exists and is_published = false


class GameReviewBase(SQLModel):
    game_spec_id: str = Field(nullable=False, foreign_key="game_spec.id", sa_type=CHAR(32), index=True)

    title: str
    potential_score: int
    rating_score: int | None

    started_at: datetime | None
    ended_at: datetime | None

    body: str | None
    is_published: bool


class GameReview(GameReviewBase, IdTimestampsMixin, table=True):
    __tablename__ = "game_review"
    __table_args__ = (UniqueConstraint("game_spec_id"),)


class GameReviewCreate(GameReviewBase):
    """Create payload.

    NOTE: Server will force is_published=false at creation time.
    """


def force_private_creation(payload: "GameReviewCreate") -> "GameReviewCreate":
    # Domain rule: Always create as non-published.
    return payload.model_copy(update={"is_published": False})


class GameReviewUpdate(GameReviewBase):
    """Full update payload."""


def validate_publishable(payload: "GameReviewUpdate") -> None:
    # Domain rule: Publishing requires both rating_score and body.
    if payload.is_published and (payload.rating_score is None or payload.body is None):
        raise GameReviewPublishValidationError("rating_score and body are required to publish")


class GameReviewListItem(SQLModel):
    game_spec_id: str
    game_title: str
    brand: str
    release_date: date

    game_review_id: str | None
    review_title: str | None
    potential_score: int | None
    rating_score: int | None
    review_created_at: datetime | None
    review_updated_at: datetime | None
    is_published: bool | None


class GameReviewListResponse(SQLModel):
    items: list[GameReviewListItem]
    total: int
    page: int
    page_size: int


class GameReviewGetResponse(SQLModel):
    game_spec_id: str
    game_title: str
    brand: str
    release_date: date

    game_review: GameReview
