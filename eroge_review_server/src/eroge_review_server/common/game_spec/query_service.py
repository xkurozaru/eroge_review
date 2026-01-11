from __future__ import annotations

from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.model import GameSpec


class GameSpecQueryService:
    def __init__(self, repo: GameSpecRepository) -> None:
        self._repo = repo

    def search_game_specs(
        self,
        *,
        title: str | None,
        brand: str | None,
        offset: int,
        limit: int,
    ) -> tuple[list[GameSpec], int]:
        return self._repo.search(title=title, brand=brand, offset=offset, limit=limit)

    def get_game_spec(self, game_spec_id: str) -> GameSpec | None:
        return self._repo.get(game_spec_id)
