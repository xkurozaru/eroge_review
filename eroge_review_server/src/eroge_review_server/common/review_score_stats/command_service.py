from __future__ import annotations

from datetime import date

from eroge_review_server.common.review_score_stats.mapper import ReviewScoreStatsRepository
from eroge_review_server.common.utils.datetime import end_of_month, now, start_of_month


class ReviewScoreStatsCommandService:
    def __init__(self, repo: ReviewScoreStatsRepository) -> None:
        self._repo = repo

    def compute_and_save_monthly(self, *, stats_month: date) -> None:
        end_ts = end_of_month(month=stats_month)
        computed = self._repo.compute_published_scores(start_ts=None, end_ts=end_ts)
        self._repo.upsert_monthly(stats_month=stats_month, computed=computed)
