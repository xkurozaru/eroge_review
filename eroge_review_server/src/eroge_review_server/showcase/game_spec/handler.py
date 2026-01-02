from fastapi import APIRouter, Depends
from sqlmodel import Session

from eroge_review_server.common.game_spec.model import GameSpec
from eroge_review_server.core.db import get_session
from eroge_review_server.showcase.game_spec.application import ShowcaseGameSpecApplication

router = APIRouter(prefix="/game-specs", tags=["game_spec"])


@router.get("")
def list_game_specs(session: Session = Depends(get_session)) -> list[GameSpec]:
    app = ShowcaseGameSpecApplication(session)
    return app.list_game_specs()
