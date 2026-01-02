from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from eroge_review_server.common.game_review.model import (
    GameReview,
    GameReviewCreate,
    GameReviewGetResponse,
    GameReviewListResponse,
    GameReviewStatus,
    GameReviewUpdate,
)
from eroge_review_server.common.utils.pager import Pager, get_pager
from eroge_review_server.console.game_review.application import ConsoleGameReviewApplication
from eroge_review_server.core.db import get_session

router = APIRouter(prefix="/game-reviews", tags=["game_review"])


@router.get("")
def list_game_reviews(
    title: str | None = None,
    brand: str | None = None,
    status: GameReviewStatus | None = None,
    pager: Pager = Depends(get_pager),
    session: Session = Depends(get_session),
) -> GameReviewListResponse:
    app = ConsoleGameReviewApplication(session)
    items, total = app.search_game_reviews(
        title=title, brand=brand, status=status, offset=pager.offset, limit=pager.limit
    )
    return GameReviewListResponse(items=items, total=total, page=pager.page, page_size=pager.page_size)


@router.post("")
def create_game_review(
    payload: GameReviewCreate,
    session: Session = Depends(get_session),
) -> GameReview:
    app = ConsoleGameReviewApplication(session)
    return app.create_game_review(payload)


@router.get("/{game_review_id}")
def get_game_review(
    game_review_id: str,
    session: Session = Depends(get_session),
) -> GameReviewGetResponse:
    app = ConsoleGameReviewApplication(session)
    row = app.get_game_review_with_game_spec(game_review_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Not found")
    game_spec, game_review = row
    return GameReviewGetResponse(
        game_spec_id=game_spec.id,
        game_title=game_spec.title,
        brand=game_spec.brand,
        release_date=game_spec.release_date,
        game_review=game_review,
    )


@router.put("/{game_review_id}")
def update_game_review(
    game_review_id: str,
    payload: GameReviewUpdate,
    session: Session = Depends(get_session),
) -> GameReview:
    app = ConsoleGameReviewApplication(session)
    model = app.update_game_review(game_review_id, payload)
    if model is None:
        raise HTTPException(status_code=404, detail="Not found")
    return model


@router.delete("/{game_review_id}")
def delete_game_review(
    game_review_id: str,
    session: Session = Depends(get_session),
) -> None:
    app = ConsoleGameReviewApplication(session)
    ok = app.delete_game_review(game_review_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Not found")
    return None
