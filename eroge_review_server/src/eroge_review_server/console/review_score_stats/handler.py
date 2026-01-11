from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from eroge_review_server.common.review_score_stats.model import ReviewScoreStatsDaily
from eroge_review_server.console.review_score_stats.application import ConsoleReviewScoreStatsApplication
from eroge_review_server.core.db import get_session

router = APIRouter(prefix="/review-score-stats", tags=["review_score_stats"])


@router.get("/daily")
def list_review_score_stats_daily(
    since: date = Query(),
    until: date = Query(),
    session: Session = Depends(get_session),
) -> list[ReviewScoreStatsDaily]:
    app = ConsoleReviewScoreStatsApplication(session)
    return app.list_daily(since=since, until=until)
