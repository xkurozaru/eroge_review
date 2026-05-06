from __future__ import annotations

from datetime import date

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel

from eroge_review_server.common.utils.sqlmodel_mixins import IdTimestampsMixin


class ReviewScoreStatsValues(SQLModel):
    rating_count: int = Field(nullable=False)
    rating_avg: float | None = Field(default=None, nullable=True)
    rating_stddev: float | None = Field(default=None, nullable=True)

    potential_count: int = Field(nullable=False)
    potential_avg: float | None = Field(default=None, nullable=True)
    potential_stddev: float | None = Field(default=None, nullable=True)


class ReviewScoreStatsMonthlyBase(ReviewScoreStatsValues):
    """Monthly snapshot of review score distributions.

    This table stores a single aggregate snapshot for each month.
    """

    stats_month: date = Field(nullable=False, index=True)


class ReviewScoreStatsComputed(ReviewScoreStatsValues):
    """Computed stats values.

    Non-table DTO for query results.
    """

    pass


class ReviewScoreStatsMonthly(ReviewScoreStatsMonthlyBase, IdTimestampsMixin, table=True):
    __tablename__ = "review_score_stats_monthly"
    __table_args__ = (UniqueConstraint("stats_month", name="uq_review_score_stats_monthly_month"),)
