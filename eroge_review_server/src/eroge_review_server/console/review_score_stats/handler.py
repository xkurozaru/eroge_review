from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from eroge_review_server.common.review_score_stats.model import ReviewScoreStatsMonthly
from eroge_review_server.console.review_score_stats.application import ConsoleReviewScoreStatsApplication
from eroge_review_server.core.db import get_session

router = APIRouter(prefix="/review-score-stats", tags=["review_score_stats"])


@router.get("/monthly")
def list_review_score_stats_monthly(
    since: date = Query(),
    until: date = Query(),
    session: Session = Depends(get_session),
) -> list[ReviewScoreStatsMonthly]:
    app = ConsoleReviewScoreStatsApplication(session)
    return app.list_monthly(since=since, until=until)
