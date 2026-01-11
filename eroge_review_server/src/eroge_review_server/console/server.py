from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer

from eroge_review_server.console.game_review.handler import router as game_review_router
from eroge_review_server.console.game_spec.handler import router as game_spec_router
from eroge_review_server.console.review_score_stats.handler import router as review_score_stats_router
from eroge_review_server.console.review_score_stats.handler_cron import router as review_score_stats_cron_router
from eroge_review_server.core.config import get_settings


def create_app() -> FastAPI:
    # NOTE: console server is reserved for internal/admin style endpoints.
    app = FastAPI(
        title="Eroge Review Console Server",
    )
    # FastAPI defaults to OpenAPI 3.1.0; pin to 3.0.x for tooling compatibility.
    app.openapi_version = "3.0.2"
    app.include_router(
        game_spec_router,
        dependencies=[Depends(require_console_token)],
    )
    app.include_router(
        game_review_router,
        dependencies=[Depends(require_console_token)],
    )
    app.include_router(
        review_score_stats_router,
        dependencies=[Depends(require_console_token)],
    )
    app.include_router(
        review_score_stats_cron_router,
        dependencies=[Depends(require_cron_token)],
    )
    return app


# Security schemes
console_token_scheme = APIKeyHeader(name="X-Console-Token", auto_error=False)
cron_token_scheme = HTTPBearer(auto_error=False)


def require_console_token(
    token: str | None = Depends(console_token_scheme),
) -> None:
    """Token-based guard for console APIs.

    Requests must provide the expected token via X-Console-Token header.
    """

    settings = get_settings()
    expected = settings.console_api_token
    if token == expected:
        return
    raise HTTPException(status_code=401, detail="Unauthorized")


def require_cron_token(
    credentials: HTTPAuthorizationCredentials | None = Depends(cron_token_scheme),
) -> None:
    """Token-based guard for cron/internal APIs.

    Requests must provide the expected token via の高さ位置と  Bearer <token> header.
    """

    settings = get_settings()
    expected = settings.cron_api_token
    if credentials and credentials.credentials == expected:
        return
    raise HTTPException(status_code=401, detail="Unauthorized")


app = create_app()
