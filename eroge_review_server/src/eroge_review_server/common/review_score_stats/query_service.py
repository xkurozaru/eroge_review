from __future__ import annotations

from datetime import date

from eroge_review_server.common.review_score_stats.mapper import ReviewScoreStatsRepository
from eroge_review_server.common.review_score_stats.model import ReviewScoreStatsMonthly


class ReviewScoreStatsQueryService:
    def __init__(self, repo: ReviewScoreStatsRepository) -> None:
        self._repo = repo

    def list_monthly(self, *, since: date, until: date) -> list[ReviewScoreStatsMonthly]:
        return self._repo.list_monthly(since=since, until=until)
