from sqlmodel import Session

from eroge_review_server.common.game_spec.command_service import GameSpecCommandService
from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.model import GameSpec, GameSpecCreate, GameSpecUpdate
from eroge_review_server.common.game_spec.query_service import GameSpecQueryService


class ConsoleGameSpecApplication:
    def __init__(self, session: Session) -> None:
        repo = GameSpecRepository(session)
        self._query_service = GameSpecQueryService(repo)
        self._command_service = GameSpecCommandService(repo)

    def list_game_specs(self) -> list[GameSpec]:
        return self._query_service.list_game_specs()

    def search_game_specs(
        self,
        *,
        title: str | None,
        brand: str | None,
        offset: int,
        limit: int,
    ) -> tuple[list[GameSpec], int]:
        return self._query_service.search_game_specs(title=title, brand=brand, offset=offset, limit=limit)

    def get_game_spec(self, game_spec_id: str) -> GameSpec | None:
        return self._query_service.get_game_spec(game_spec_id)

    def create_game_spec(self, payload: GameSpecCreate) -> GameSpec:
        return self._command_service.create_game_spec(payload)

    def update_game_spec(self, game_spec_id: str, payload: GameSpecUpdate) -> GameSpec | None:
        return self._command_service.update_game_spec(game_spec_id, payload)

    def delete_game_spec(self, game_spec_id: str) -> bool:
        return self._command_service.delete_game_spec(game_spec_id)
