from __future__ import annotations

from datetime import date, datetime
from enum import Enum

from sqlalchemy import CHAR, DateTime, UniqueConstraint
from sqlmodel import Field, SQLModel

from eroge_review_server.common.game_review.exception import GameReviewPublishValidationError
from eroge_review_server.common.utils.sqlmodel_mixins import IdTimestampsMixin


class GameReviewStatus(str, Enum):
    unreviewed = "unreviewed"  # game_review does not exist
    published = "published"  # game_review exists and published_at is not null
    draft = "draft"  # game_review exists and published_at is null


class GameReviewBase(SQLModel):
    game_spec_id: str = Field(nullable=False, foreign_key="game_spec.id", sa_type=CHAR(32), index=True)

    title: str
    potential_score: int
    rating_score: int | None

    started_at: datetime | None
    ended_at: datetime | None

    body: str | None


class GameReview(GameReviewBase, IdTimestampsMixin, table=True):
    __tablename__ = "game_review"
    __table_args__ = (UniqueConstraint("game_spec_id"),)

    # Server-managed publish timestamp. NULL means draft/unpublished.
    published_at: datetime | None = Field(default=None, sa_type=DateTime(timezone=True), nullable=True)


class GameReviewCreate(GameReviewBase):
    """Create payload.

    NOTE: Clients send publish intent via is_published.
    Server will set published_at accordingly.
    """

    is_published: bool = False


class GameReviewUpdate(GameReviewBase):
    """Full update payload."""

    # Require the field to avoid ambiguous publish state.
    is_published: bool


def validate_publishable(*, is_published: bool, rating_score: int | None, body: str | None) -> None:
    # Domain rule: Publishing requires both rating_score and body.
    if is_published and (rating_score is None or body is None):
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
    published_at: datetime | None


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
