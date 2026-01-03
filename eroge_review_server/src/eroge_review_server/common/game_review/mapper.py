from __future__ import annotations

from datetime import datetime, timezone

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

        match status:
            case GameReviewStatus.unreviewed:
                statement = statement.where(GameReview.id.is_(None))
                count_statement = count_statement.where(GameReview.id.is_(None))

            case GameReviewStatus.draft:
                statement = statement.where(GameReview.id.is_not(None)).where(GameReview.published_at.is_(None))
                count_statement = count_statement.where(GameReview.id.is_not(None)).where(
                    GameReview.published_at.is_(None)
                )

            case GameReviewStatus.published:
                statement = statement.where(GameReview.published_at.is_not(None))
                count_statement = count_statement.where(GameReview.published_at.is_not(None))

        if status == GameReviewStatus.published:
            statement = statement.order_by(GameReview.published_at.desc(), GameSpec.id.desc())
        else:
            statement = statement.order_by(GameSpec.id.desc())

        statement = statement.offset(offset).limit(limit)

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
                    review_created_at=(game_review.created_at if game_review else None),
                    review_updated_at=(game_review.updated_at if game_review else None),
                    published_at=(game_review.published_at if game_review else None),
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
        model = GameReview(
            game_spec_id=payload.game_spec_id,
            title=payload.title,
            potential_score=payload.potential_score,
            rating_score=payload.rating_score,
            started_at=payload.started_at,
            ended_at=payload.ended_at,
            body=payload.body,
            published_at=(datetime.now(timezone.utc) if payload.is_published else None),
        )
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

        # Publishing semantics:
        # - is_published False => unpublish
        # - is_published True  => publish (first time sets server timestamp)
        if not payload.is_published:
            model.published_at = None
        elif model.published_at is None:
            model.published_at = datetime.now(timezone.utc)

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
