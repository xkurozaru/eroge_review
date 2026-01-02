from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.model import GameSpec


class GameSpecQueryService:
    def __init__(self, repo: GameSpecRepository) -> None:
        self._repo = repo

    def list_game_specs(self) -> list[GameSpec]:
        return self._repo.list()
