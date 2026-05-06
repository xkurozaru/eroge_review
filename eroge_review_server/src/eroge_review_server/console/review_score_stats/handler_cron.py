from __future__ import annotations

from datetime import date
from time import time

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlmodel import Session

from eroge_review_server.console.review_score_stats.application import ConsoleReviewScoreStatsApplication
from eroge_review_server.core.db import get_session

router = APIRouter(prefix="/internal/cron/review-score-stats", tags=["cron"])


class CronReviewScoreStatsMonthlyResponse(BaseModel):
    stats_month: date
    execution_time: float


@router.get("/monthly")
def run_review_score_stats_monthly(
    target_date: date | None = Query(default=None, alias="date"),
    session: Session = Depends(get_session),
) -> CronReviewScoreStatsMonthlyResponse:
    start_time = time()

    app = ConsoleReviewScoreStatsApplication(session)
    stats_month = app.run_monthly_snapshot(stats_month=target_date)

    execution_time = time() - start_time
    return CronReviewScoreStatsMonthlyResponse(stats_month=stats_month, execution_time=execution_time)
