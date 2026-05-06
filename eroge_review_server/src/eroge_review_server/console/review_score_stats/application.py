from __future__ import annotations

from datetime import date, timedelta

from sqlmodel import Session

from eroge_review_server.common.review_score_stats.command_service import ReviewScoreStatsCommandService
from eroge_review_server.common.review_score_stats.mapper import ReviewScoreStatsRepository
from eroge_review_server.common.review_score_stats.model import ReviewScoreStatsMonthly
from eroge_review_server.common.review_score_stats.query_service import ReviewScoreStatsQueryService
from eroge_review_server.common.utils.datetime import now


class ConsoleReviewScoreStatsApplication:
    def __init__(self, session: Session) -> None:
        repo = ReviewScoreStatsRepository(session)
        self._query_service = ReviewScoreStatsQueryService(repo)
        self._command_service = ReviewScoreStatsCommandService(repo)
        self._session = session

    def list_monthly(self, *, since: date, until: date) -> list[ReviewScoreStatsMonthly]:
        return self._query_service.list_monthly(since=since, until=until)

    def run_monthly_snapshot(self, *, stats_month: date | None) -> date:
        target = stats_month or _default_stats_month_jst()
        target = target.replace(day=1)
        self._command_service.compute_and_save_monthly(stats_month=target)
        self._session.commit()
        return target


def _default_stats_month_jst() -> date:
    """Pick the current month in JST.

    This endpoint is intended for daily cron updates of the current month.
    """

    return now().date().replace(day=1)
