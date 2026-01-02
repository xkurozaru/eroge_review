from __future__ import annotations

from eroge_review_server.common.game_review.mapper import GameReviewRepository
from eroge_review_server.common.game_review.model import GameReview, GameReviewListItem, GameReviewStatus
from eroge_review_server.common.game_spec.model import GameSpec


class GameReviewQueryService:
    def __init__(self, repo: GameReviewRepository) -> None:
        self._repo = repo

    def search_game_reviews(
        self,
        *,
        title: str | None,
        brand: str | None,
        status: GameReviewStatus | None,
        offset: int,
        limit: int,
    ) -> tuple[list[GameReviewListItem], int]:
        return self._repo.search_with_game_spec(title=title, brand=brand, status=status, offset=offset, limit=limit)

    def get_game_review(self, game_review_id: str) -> GameReview | None:
        return self._repo.get(game_review_id)

    def get_game_review_with_game_spec(self, game_review_id: str) -> tuple[GameSpec, GameReview] | None:
        return self._repo.get_with_game_spec(game_review_id)

    def get_by_game_spec_id(self, game_spec_id: str) -> GameReview | None:
        return self._repo.get_by_game_spec_id(game_spec_id)
