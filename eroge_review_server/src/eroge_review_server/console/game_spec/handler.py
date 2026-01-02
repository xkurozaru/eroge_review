from fastapi import APIRouter, Depends
from sqlmodel import Session

from eroge_review_server.common.game_spec.model import GameSpec, GameSpecCreate
from eroge_review_server.console.game_spec.application import ConsoleGameSpecApplication
from eroge_review_server.core.db import get_session

router = APIRouter(prefix="/game-specs", tags=["game_spec"])


@router.get("/")
def list_game_specs(session: Session = Depends(get_session)) -> list[GameSpec]:
    app = ConsoleGameSpecApplication(session)
    return app.list_game_specs()


@router.post("/")
def create_game_spec(
    payload: GameSpecCreate,
    session: Session = Depends(get_session),
) -> GameSpec:
    app = ConsoleGameSpecApplication(session)
    return app.create_game_spec(payload)
