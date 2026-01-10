from __future__ import annotations

from datetime import date, datetime, timedelta

from eroge_review_server.common.review_score_stats.mapper import (
    ReviewScoreStatsRepository,
)
from eroge_review_server.common.utils.datetime import end_of_day


class ReviewScoreStatsScope:
    PUBLISHED_ALL = "published_all"
    PUBLISHED_90D = "published_90d"


class ReviewScoreStatsCommandService:
    def __init__(self, repo: ReviewScoreStatsRepository) -> None:
        self._repo = repo

    def compute_and_save_daily(self, *, stats_date: date, scope: ReviewScoreStatsScope) -> None:
        end_ts = end_of_day(stats_date)
        start_ts = _start_ts_for_scope(scope=scope, end_ts=end_ts)
        computed = self._repo.compute_published_scores(start_ts=start_ts, end_ts=end_ts)
        self._repo.upsert_daily(stats_date=stats_date, scope=scope, computed=computed)


def _start_ts_for_scope(*, scope: ReviewScoreStatsScope, end_ts: datetime) -> datetime | None:
    if scope == ReviewScoreStatsScope.PUBLISHED_ALL:
        return None
    if scope == ReviewScoreStatsScope.PUBLISHED_90D:
        return end_ts - timedelta(days=90)
    raise ValueError(f"Unsupported scope: {scope!r}")
