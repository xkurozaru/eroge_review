from __future__ import annotations

from eroge_review_server.common.game_review.mapper import GameReviewRepository
from eroge_review_server.common.game_review.model import (
    GameReview,
    GameReviewCreate,
    GameReviewUpdate,
    force_private_creation,
    validate_publishable,
)


class GameReviewCommandService:
    def __init__(self, repo: GameReviewRepository) -> None:
        self._repo = repo

    def create_game_review(self, payload: GameReviewCreate) -> GameReview:
        normalized = force_private_creation(payload)
        return self._repo.create(normalized)

    def update_game_review(self, game_review_id: str, payload: GameReviewUpdate) -> GameReview | None:
        validate_publishable(payload)
        return self._repo.update(game_review_id, payload)

    def delete_game_review(self, game_review_id: str) -> bool:
        return self._repo.delete(game_review_id)
