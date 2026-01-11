from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from eroge_review_server.common.game_spec.model import GameSpec, GameSpecCreate, GameSpecListResponse, GameSpecUpdate
from eroge_review_server.common.utils.pager import Pager, get_pager
from eroge_review_server.console.game_spec.application import ConsoleGameSpecApplication
from eroge_review_server.core.db import get_session

router = APIRouter(prefix="/game-specs", tags=["game_spec"])


@router.get("")
def list_game_specs(
    title: str | None = None,
    brand: str | None = None,
    pager: Pager = Depends(get_pager),
    session: Session = Depends(get_session),
) -> GameSpecListResponse:
    app = ConsoleGameSpecApplication(session)
    items, total = app.search_game_specs(title=title, brand=brand, offset=pager.offset, limit=pager.limit)
    return GameSpecListResponse(items=items, total=total, page=pager.page, page_size=pager.page_size)


@router.post("")
def create_game_spec(
    payload: GameSpecCreate,
    session: Session = Depends(get_session),
) -> GameSpec:
    app = ConsoleGameSpecApplication(session)
    return app.create_game_spec(payload)


@router.get("/{game_spec_id}")
def get_game_spec(
    game_spec_id: str,
    session: Session = Depends(get_session),
) -> GameSpec:
    app = ConsoleGameSpecApplication(session)
    model = app.get_game_spec(game_spec_id)
    if model is None:
        raise HTTPException(status_code=404, detail="Not found")
    return model


@router.put("/{game_spec_id}")
def update_game_spec(
    game_spec_id: str,
    payload: GameSpecUpdate,
    session: Session = Depends(get_session),
) -> GameSpec:
    app = ConsoleGameSpecApplication(session)
    model = app.update_game_spec(game_spec_id, payload)
    if model is None:
        raise HTTPException(status_code=404, detail="Not found")
    return model


@router.delete("/{game_spec_id}")
def delete_game_spec(
    game_spec_id: str,
    session: Session = Depends(get_session),
) -> None:
    app = ConsoleGameSpecApplication(session)
    ok = app.delete_game_spec(game_spec_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Not found")
    return None
