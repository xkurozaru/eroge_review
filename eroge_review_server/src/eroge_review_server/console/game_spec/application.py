from sqlmodel import Session

from eroge_review_server.common.game_spec.command_service import GameSpecCommandService
from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.model import GameSpec, GameSpecCreate


class ConsoleGameSpecApplication:
    def __init__(self, session: Session) -> None:
        repo = GameSpecRepository(session)
        self._service = GameSpecCommandService(repo)

    def create_game_spec(self, payload: GameSpecCreate) -> GameSpec:
        return self._service.create_game_spec(payload)
