from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.model import GameSpec, GameSpecCreate


class GameSpecCommandService:
    def __init__(self, repo: GameSpecRepository) -> None:
        self._repo = repo

    def create_game_spec(self, payload: GameSpecCreate) -> GameSpec:
        return self._repo.create(payload)
