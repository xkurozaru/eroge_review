from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import func
from sqlmodel import Session, select

from eroge_review_server.common.game_review.model import GameReview
from eroge_review_server.common.review_score_stats.model import ReviewScoreStatsComputed, ReviewScoreStatsDaily


class ReviewScoreStatsRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_daily(self, *, since: date, until: date) -> list[ReviewScoreStatsDaily]:
        statement = (
            select(ReviewScoreStatsDaily)
            .where(ReviewScoreStatsDaily.stats_date >= since, ReviewScoreStatsDaily.stats_date <= until)
            .order_by(ReviewScoreStatsDaily.stats_date)
        )
        return list(self._session.exec(statement).all())

    def compute_published_scores(
        self,
        *,
        start_ts: datetime | None,
        end_ts: datetime,
    ) -> ReviewScoreStatsComputed:
        conditions = [GameReview.published_at.is_not(None), GameReview.published_at < end_ts]
        if start_ts is not None:
            conditions.append(GameReview.published_at >= start_ts)

        statement = select(
            func.count(GameReview.rating_score).label("rating_count"),
            func.avg(GameReview.rating_score).label("rating_avg"),
            func.stddev_samp(GameReview.rating_score).label("rating_stddev"),
            func.count(GameReview.potential_score).label("potential_count"),
            func.avg(GameReview.potential_score).label("potential_avg"),
            func.stddev_samp(GameReview.potential_score).label("potential_stddev"),
        ).where(*conditions)

        row = self._session.exec(statement).one()

        # Map by field names (SQLModel/Pydantic will coerce types as needed).
        return ReviewScoreStatsComputed.model_validate(dict(row._mapping))

    def upsert_daily(
        self,
        *,
        stats_date: date,
        scope: str,
        computed: ReviewScoreStatsComputed,
    ) -> None:
        existing = self._session.exec(
            select(ReviewScoreStatsDaily).where(
                ReviewScoreStatsDaily.stats_date == stats_date,
                ReviewScoreStatsDaily.scope == scope,
            )
        ).one_or_none()

        if existing is None:
            model = ReviewScoreStatsDaily(
                stats_date=stats_date,
                scope=scope,
                rating_count=computed.rating_count,
                rating_avg=computed.rating_avg,
                rating_stddev=computed.rating_stddev,
                potential_count=computed.potential_count,
                potential_avg=computed.potential_avg,
                potential_stddev=computed.potential_stddev,
            )
            self._session.add(model)
            return

        existing.rating_count = computed.rating_count
        existing.rating_avg = computed.rating_avg
        existing.rating_stddev = computed.rating_stddev
        existing.potential_count = computed.potential_count
        existing.potential_avg = computed.potential_avg
        existing.potential_stddev = computed.potential_stddev

        # ORM will issue an UPDATE on commit/flush; IdTimestampsMixin has onupdate=func.now().
        # No explicit updated_at assignment needed.
