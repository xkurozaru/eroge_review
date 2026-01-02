from __future__ import annotations

from fastapi import HTTPException
from sqlmodel import Session

from eroge_review_server.common.game_review.command_service import GameReviewCommandService
from eroge_review_server.common.game_review.exception import GameReviewPublishValidationError
from eroge_review_server.common.game_review.mapper import GameReviewRepository
from eroge_review_server.common.game_review.model import (
    GameReview,
    GameReviewCreate,
    GameReviewListItem,
    GameReviewStatus,
    GameReviewUpdate,
)
from eroge_review_server.common.game_review.query_service import GameReviewQueryService
from eroge_review_server.common.game_spec.model import GameSpec


class ConsoleGameReviewApplication:
    def __init__(self, session: Session) -> None:
        self._session = session
        repo = GameReviewRepository(session)
        self._query_service = GameReviewQueryService(repo)
        self._command_service = GameReviewCommandService(repo)

    def search_game_reviews(
        self,
        *,
        title: str | None,
        brand: str | None,
        status: GameReviewStatus | None,
        offset: int,
        limit: int,
    ) -> tuple[list[GameReviewListItem], int]:
        return self._query_service.search_game_reviews(
            title=title, brand=brand, status=status, offset=offset, limit=limit
        )

    def get_game_review_with_game_spec(self, game_review_id: str) -> tuple[GameSpec, GameReview] | None:
        return self._query_service.get_game_review_with_game_spec(game_review_id)

    def create_game_review(self, payload: GameReviewCreate) -> GameReview:
        game_spec = self._session.get(GameSpec, payload.game_spec_id)
        if game_spec is None:
            raise HTTPException(status_code=404, detail="GameSpec not found")

        existing = self._query_service.get_by_game_spec_id(payload.game_spec_id)
        if existing is not None:
            raise HTTPException(status_code=409, detail="GameReview already exists")

        return self._command_service.create_game_review(payload)

    def update_game_review(self, game_review_id: str, payload: GameReviewUpdate) -> GameReview | None:
        try:
            return self._command_service.update_game_review(game_review_id, payload)
        except GameReviewPublishValidationError as e:
            raise HTTPException(status_code=422, detail=str(e))

    def delete_game_review(self, game_review_id: str) -> bool:
        return self._command_service.delete_game_review(game_review_id)
