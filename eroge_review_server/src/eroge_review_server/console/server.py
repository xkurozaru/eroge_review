from fastapi import Depends, FastAPI, Header, HTTPException, Request

from eroge_review_server.console.game_review.handler import router as game_review_router
from eroge_review_server.console.game_spec.handler import router as game_spec_router
from eroge_review_server.console.review_score_stats.handler import router as review_score_stats_router
from eroge_review_server.core.config import get_settings


def create_app() -> FastAPI:
    # NOTE: console server is reserved for internal/admin style endpoints.
    # Keep minimal scaffold for now.
    app = FastAPI(
        title="Eroge Review Console Server",
        dependencies=[Depends(require_console_token)],
    )
    # FastAPI defaults to OpenAPI 3.1.0; pin to 3.0.x for tooling compatibility.
    app.openapi_version = "3.0.2"
    app.include_router(review_score_stats_router)
    app.include_router(game_spec_router)
    app.include_router(game_review_router)
    return app


def require_console_token(
    request: Request,
    x_console_token: str | None = Header(default=None, alias="X-Console-Token"),
    authorization: str | None = Header(default=None, alias="Authorization"),
) -> None:
    """Optional token-based guard for console APIs.

    If CONSOLE_API_TOKEN is unset, this is a no-op (useful for local/dev).
    If set, requests must provide the same value via X-Console-Token header.
    """

    settings = get_settings()

    # Cron endpoints may use CRON_API_TOKEN (or fall back to CONSOLE_API_TOKEN).
    if request.url.path.startswith("/internal/cron"):
        expected = settings.cron_api_token
        if not expected:
            return

        if authorization and authorization.startswith("Bearer "):
            token = authorization.removeprefix("Bearer ").strip()
            if token == expected:
                return

        raise HTTPException(status_code=401, detail="Unauthorized")

    # Regular console/admin endpoints are protected by CONSOLE_API_TOKEN only.
    expected = settings.console_api_token
    if not expected:
        return
    if x_console_token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")


app = create_app()
