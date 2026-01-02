import os

from fastapi import Depends, FastAPI, Header, HTTPException

from eroge_review_server.console.game_spec.handler import router as game_spec_router


def create_app() -> FastAPI:
    # NOTE: console server is reserved for internal/admin style endpoints.
    # Keep minimal scaffold for now.
    app = FastAPI(
        title="Eroge Review Console Server",
        dependencies=[Depends(require_console_token)],
    )
    # FastAPI defaults to OpenAPI 3.1.0; pin to 3.0.x for tooling compatibility.
    app.openapi_version = "3.0.2"
    app.include_router(game_spec_router)
    return app


def require_console_token(x_console_token: str | None = Header(default=None)) -> None:
    """Optional token-based guard for console APIs.

    If CONSOLE_API_TOKEN is unset, this is a no-op (useful for local/dev).
    If set, requests must provide the same value via X-Console-Token header.
    """

    expected = os.getenv("CONSOLE_API_TOKEN")
    if not expected:
        return
    if x_console_token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")


app = create_app()
