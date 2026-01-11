from __future__ import annotations

from fastapi import FastAPI

from eroge_review_server.showcase.game_spec.handler import router as game_spec_router


def create_app() -> FastAPI:
    app = FastAPI(title="Eroge Review Showcase Server")
    # FastAPI defaults to OpenAPI 3.1.0; pin to 3.0.x for tooling compatibility.
    app.openapi_version = "3.0.2"

    app.include_router(game_spec_router)
    return app


app = create_app()
