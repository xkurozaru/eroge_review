from eroge_review_server.src.eroge_review_server.common.game_spec.model import (
    GameSpec,
    GameSpecCreate,
)
from eroge_review_server.src.eroge_review_server.common.game_spec.mapper import GameSpecRepository


class GameSpecService:
    def __init__(self, repo: GameSpecRepository) -> None:
        self._repo = repo

    def list_game_specs(self) -> list[GameSpec]:
        return self._repo.list()

    def create_game_spec(self, payload: GameSpecCreate) -> GameSpec:
        return self._repo.create(payload)
