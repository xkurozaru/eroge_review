from fastapi import FastAPI

from eroge_review_server.console.game_spec.handler import router as game_spec_router


def create_app() -> FastAPI:
    # NOTE: console server is reserved for internal/admin style endpoints.
    # Keep minimal scaffold for now.
    app = FastAPI(title="Eroge Review Console Server")
    # FastAPI defaults to OpenAPI 3.1.0; pin to 3.0.x for tooling compatibility.
    app.openapi_version = "3.0.2"
    app.include_router(game_spec_router)
    return app


app = create_app()
