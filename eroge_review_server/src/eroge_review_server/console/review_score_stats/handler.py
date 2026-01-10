from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from eroge_review_server.console.review_score_stats.application import ConsoleReviewScoreStatsApplication
from eroge_review_server.core.db import get_session

router = APIRouter(prefix="/internal/cron/review-score-stats", tags=["cron"])


@router.get("/daily")
def run_review_score_stats_daily(
    target_date: date | None = Query(default=None, alias="date"),
    session: Session = Depends(get_session),
) -> None:
    app = ConsoleReviewScoreStatsApplication(session)
    app.run_daily_snapshot(stats_date=target_date)
