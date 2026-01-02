from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.model import GameSpec, GameSpecCreate, GameSpecUpdate


class GameSpecCommandService:
    def __init__(self, repo: GameSpecRepository) -> None:
        self._repo = repo

    def create_game_spec(self, payload: GameSpecCreate) -> GameSpec:
        return self._repo.create(payload)

    def update_game_spec(self, game_spec_id: str, payload: GameSpecUpdate) -> GameSpec | None:
        return self._repo.update(game_spec_id, payload)

    def delete_game_spec(self, game_spec_id: str) -> bool:
        return self._repo.delete(game_spec_id)
