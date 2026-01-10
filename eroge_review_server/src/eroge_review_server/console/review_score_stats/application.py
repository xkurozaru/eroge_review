from __future__ import annotations

from datetime import date, timedelta

from sqlmodel import Session

from eroge_review_server.common.review_score_stats.command_service import (
    ReviewScoreStatsCommandService,
    ReviewScoreStatsScope,
)
from eroge_review_server.common.review_score_stats.mapper import ReviewScoreStatsRepository
from eroge_review_server.common.utils.datetime import now


class ConsoleReviewScoreStatsApplication:
    def __init__(self, session: Session) -> None:
        repo = ReviewScoreStatsRepository(session)
        self._command_service = ReviewScoreStatsCommandService(repo)
        self._session = session

    def run_daily_snapshot(self, *, stats_date: date | None) -> None:
        target = stats_date or _default_stats_date_jst()

        for scope in [ReviewScoreStatsScope.PUBLISHED_ALL, ReviewScoreStatsScope.PUBLISHED_90D]:
            self._command_service.compute_and_save_daily(
                stats_date=target,
                scope=scope,
            )
        self._session.commit()


def _default_stats_date_jst() -> date:
    """Pick a stable day that has already ended in JST.

    This is an application-level policy for the cron endpoint.
    Default: yesterday (JST).
    """

    return now().date() - timedelta(days=1)
