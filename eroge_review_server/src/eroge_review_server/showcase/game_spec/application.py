from __future__ import annotations

from sqlmodel import Session

from eroge_review_server.common.game_spec.mapper import GameSpecRepository
from eroge_review_server.common.game_spec.query_service import GameSpecQueryService


class ShowcaseGameSpecApplication:
    def __init__(self, session: Session) -> None:
        repo = GameSpecRepository(session)
        self._query_service = GameSpecQueryService(repo)
