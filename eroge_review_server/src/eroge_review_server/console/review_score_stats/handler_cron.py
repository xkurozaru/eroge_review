from datetime import date
from time import time

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlmodel import Session

from eroge_review_server.console.review_score_stats.application import ConsoleReviewScoreStatsApplication
from eroge_review_server.core.db import get_session

router = APIRouter(prefix="/internal/cron/review-score-stats", tags=["cron"])


class CronReviewScoreStatsDailyResponse(BaseModel):
    stats_date: date
    execution_time: float


@router.get("/daily")
def run_review_score_stats_daily(
    target_date: date | None = Query(default=None, alias="date"),
    session: Session = Depends(get_session),
) -> CronReviewScoreStatsDailyResponse:
    start_time = time()

    app = ConsoleReviewScoreStatsApplication(session)
    date = app.run_daily_snapshot(stats_date=target_date)

    execution_time = time() - start_time
    return CronReviewScoreStatsDailyResponse(stats_date=date, execution_time=execution_time)
