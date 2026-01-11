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


class ReviewScoreStatsDailyBase(ReviewScoreStatsValues):
    """Daily snapshot of review score distributions.

    This table is meant to be scope-driven so that new aggregation windows/filters
    can be added later without schema changes.

    Examples of scope: "published_all", "published_90d".
    """

    stats_date: date = Field(nullable=False, index=True)
    scope: str = Field(nullable=False, index=True)


class ReviewScoreStatsComputed(ReviewScoreStatsValues):
    """Computed stats values.

    Non-table DTO for query results.
    """

    pass


class ReviewScoreStatsDaily(ReviewScoreStatsDailyBase, IdTimestampsMixin, table=True):
    __tablename__ = "review_score_stats_daily"
    __table_args__ = (UniqueConstraint("stats_date", "scope", name="uq_review_score_stats_daily_date_scope"),)
