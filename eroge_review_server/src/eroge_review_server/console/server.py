from fastapi import Depends, FastAPI, Header, HTTPException

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


def require_console_token(
    x_console_token: str | None = Header(default=None, alias="X-Console-Token"),
) -> None:
    """Token-based guard for console APIs.

    Requests must provide the expected token via X-Console-Token header.
    """

    settings = get_settings()
    expected = settings.console_api_token
    if x_console_token == expected:
        return
    raise HTTPException(status_code=401, detail="Unauthorized")


def require_cron_token(
    authorization: str | None = Header(default=None, alias="Authorization"),
) -> None:
    """Token-based guard for cron/internal APIs.

    Requests must provide the expected token via Authorization: Bearer <token> header.
    """

    settings = get_settings()
    expected = settings.cron_api_token
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ").strip()
        if token == expected:
            return
    raise HTTPException(status_code=401, detail="Unauthorized")


app = create_app()
