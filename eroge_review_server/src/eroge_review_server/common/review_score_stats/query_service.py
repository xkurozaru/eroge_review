from __future__ import annotations

from datetime import date

from eroge_review_server.common.review_score_stats.mapper import ReviewScoreStatsRepository
from eroge_review_server.common.review_score_stats.model import ReviewScoreStatsDaily


class ReviewScoreStatsQueryService:
    def __init__(self, repo: ReviewScoreStatsRepository) -> None:
        self._repo = repo

    def list_daily(self, *, since: date, until: date) -> list[ReviewScoreStatsDaily]:
        return self._repo.list_daily(since=since, until=until)
