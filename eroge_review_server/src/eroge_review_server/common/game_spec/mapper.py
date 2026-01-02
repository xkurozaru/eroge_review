from sqlmodel import Session, select

from eroge_review_server.src.eroge_review_server.common.game_spec.model import (
    GameSpec,
    GameSpecCreate,
)


class GameSpecRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list(self) -> list[GameSpec]:
        statement = select(GameSpec).order_by(GameSpec.id)
        return list(self._session.exec(statement))

    def create(self, payload: GameSpecCreate) -> GameSpec:
        model = GameSpec.model_validate(payload)
        self._session.add(model)
        self._session.commit()
        self._session.refresh(model)
        return model
