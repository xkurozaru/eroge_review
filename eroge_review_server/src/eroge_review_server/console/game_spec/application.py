from sqlmodel import Session

from eroge_review_server.common.game_spec.command_service import GameSpecCommandService
from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.model import GameSpec, GameSpecCreate
from eroge_review_server.common.game_spec.query_service import GameSpecQueryService


class ConsoleGameSpecApplication:
    def __init__(self, session: Session) -> None:
        repo = GameSpecRepository(session)
        self._query_service = GameSpecQueryService(repo)
        self._command_service = GameSpecCommandService(repo)

    def list_game_specs(self) -> list[GameSpec]:
        return self._query_service.list_game_specs()

    def create_game_spec(self, payload: GameSpecCreate) -> GameSpec:
        return self._command_service.create_game_spec(payload)
