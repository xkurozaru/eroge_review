from sqlmodel import Session

from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.model import GameSpec
from eroge_review_server.common.game_spec.query_service import GameSpecQueryService


class ControllerGameSpecApplication:
    def __init__(self, session: Session) -> None:
        repo = GameSpecRepository(session)
        self._service = GameSpecQueryService(repo)

    def list_game_specs(self) -> list[GameSpec]:
        return self._service.list_game_specs()
