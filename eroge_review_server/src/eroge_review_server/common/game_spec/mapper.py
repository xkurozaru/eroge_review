from sqlmodel import Session, func, select

from eroge_review_server.common.game_spec.model import GameSpec, GameSpecCreate, GameSpecUpdate


class GameSpecRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def search(
        self,
        *,
        title: str | None,
        brand: str | None,
        offset: int,
        limit: int,
    ) -> tuple[list[GameSpec], int]:
        statement = select(GameSpec)
        count_statement = select(func.count()).select_from(GameSpec)

        if title:
            like = f"%{title}%"
            statement = statement.where(GameSpec.title.ilike(like))
            count_statement = count_statement.where(GameSpec.title.ilike(like))

        if brand:
            like = f"%{brand}%"
            statement = statement.where(GameSpec.brand.ilike(like))
            count_statement = count_statement.where(GameSpec.brand.ilike(like))

        statement = statement.order_by(GameSpec.id.desc()).offset(offset).limit(limit)

        items = list(self._session.exec(statement))
        total_row = self._session.exec(count_statement).one()
        total = int(total_row[0] if isinstance(total_row, tuple) else total_row)
        return items, total

    def get(self, game_spec_id: str) -> GameSpec | None:
        return self._session.get(GameSpec, game_spec_id)

    def create(self, payload: GameSpecCreate) -> GameSpec:
        model = GameSpec.model_validate(payload)
        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return model

    def update(self, game_spec_id: str, payload: GameSpecUpdate) -> GameSpec | None:
        model = self.get(game_spec_id)
        if model is None:
            return None

        model.title = payload.title
        model.brand = payload.brand
        model.release_date = payload.release_date

        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return model

    def delete(self, game_spec_id: str) -> bool:
        model = self.get(game_spec_id)
        if model is None:
            return False
        self._session.delete(model)
        self._session.commit()
        return True
