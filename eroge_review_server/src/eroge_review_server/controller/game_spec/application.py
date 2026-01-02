from sqlmodel import Session

from eroge_review_server.src.eroge_review_server.common.game_spec.model import (
    GameSpec,
    GameSpecCreate,
)
from eroge_review_server.src.eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.src.eroge_review_server.common.game_spec.service import GameSpecService


class GameSpecApplication:
    def __init__(self, session: Session) -> None:
        repo = GameSpecRepository(session)
        self._service = GameSpecService(repo)

    def list_game_specs(self) -> list[GameSpec]:
        return self._service.list_game_specs()

    def create_game_spec(self, payload: GameSpecCreate) -> GameSpec:
        return self._service.create_game_spec(payload)
