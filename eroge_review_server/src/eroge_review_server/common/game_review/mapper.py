from __future__ import annotations

from sqlmodel import Session, func, select

from eroge_review_server.common.game_review.model import (
    GameReview,
    GameReviewCreate,
    GameReviewListItem,
    GameReviewStatus,
    GameReviewUpdate,
)
from eroge_review_server.common.game_spec.model import GameSpec


class GameReviewRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def search_with_game_spec(
        self,
        *,
        title: str | None,
        brand: str | None,
        status: GameReviewStatus | None,
        offset: int,
        limit: int,
    ) -> tuple[list[GameReviewListItem], int]:
        join_on = GameReview.game_spec_id == GameSpec.id

        statement = select(GameSpec, GameReview).join(GameReview, join_on, isouter=True)
        count_statement = select(func.count()).select_from(GameSpec).join(GameReview, join_on, isouter=True)

        if title:
            like = f"%{title}%"
            statement = statement.where(GameSpec.title.ilike(like))
            count_statement = count_statement.where(GameSpec.title.ilike(like))

        if brand:
            like = f"%{brand}%"
            statement = statement.where(GameSpec.brand.ilike(like))
            count_statement = count_statement.where(GameSpec.brand.ilike(like))

        if status == GameReviewStatus.unreviewed:
            statement = statement.where(GameReview.id.is_(None))
            count_statement = count_statement.where(GameReview.id.is_(None))
        elif status == GameReviewStatus.published:
            statement = statement.where(GameReview.is_published.is_(True))
            count_statement = count_statement.where(GameReview.is_published.is_(True))
        elif status == GameReviewStatus.draft:
            statement = statement.where(GameReview.id.is_not(None)).where(GameReview.is_published.is_(False))
            count_statement = count_statement.where(GameReview.id.is_not(None)).where(
                GameReview.is_published.is_(False)
            )

        statement = statement.order_by(GameSpec.id.desc()).offset(offset).limit(limit)

        rows = list(self._session.exec(statement))
        total_row = self._session.exec(count_statement).one()
        total = int(total_row[0] if isinstance(total_row, tuple) else total_row)

        items: list[GameReviewListItem] = []
        for game_spec, game_review in rows:
            items.append(
                GameReviewListItem(
                    game_spec_id=game_spec.id,
                    game_title=game_spec.title,
                    brand=game_spec.brand,
                    release_date=game_spec.release_date,
                    game_review_id=(game_review.id if game_review else None),
                    review_title=(game_review.title if game_review else None),
                    potential_score=(game_review.potential_score if game_review else None),
                    rating_score=(game_review.rating_score if game_review else None),
                    is_published=(game_review.is_published if game_review else None),
                )
            )

        return items, total

    def get(self, game_review_id: str) -> GameReview | None:
        return self._session.get(GameReview, game_review_id)

    def get_with_game_spec(self, game_review_id: str) -> tuple[GameSpec, GameReview] | None:
        join_on = GameReview.game_spec_id == GameSpec.id
        statement = (
            select(GameSpec, GameReview)
            .join(GameReview, join_on, isouter=False)
            .where(GameReview.id == game_review_id)
            .limit(1)
        )
        row = self._session.exec(statement).first()
        if row is None:
            return None
        return row

    def get_by_game_spec_id(self, game_spec_id: str) -> GameReview | None:
        statement = select(GameReview).where(GameReview.game_spec_id == game_spec_id).limit(1)
        return self._session.exec(statement).first()

    def create(self, payload: GameReviewCreate) -> GameReview:
        model = GameReview.model_validate(payload)
        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return model

    def update(self, game_review_id: str, payload: GameReviewUpdate) -> GameReview | None:
        model = self.get(game_review_id)
        if model is None:
            return None

        model.title = payload.title
        model.potential_score = payload.potential_score
        model.rating_score = payload.rating_score
        model.started_at = payload.started_at
        model.ended_at = payload.ended_at
        model.body = payload.body
        model.is_published = payload.is_published

        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return model

    def delete(self, game_review_id: str) -> bool:
        model = self.get(game_review_id)
        if model is None:
            return False
        self._session.delete(model)
        self._session.commit()
        return True
