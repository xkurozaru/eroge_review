from fastapi import FastAPI

from eroge_review_server.controller.game_spec.handler import router as game_spec_router


def create_app() -> FastAPI:
    app = FastAPI(title="Eroge Review Controller Server")

    app.include_router(game_spec_router)
    return app


app = create_app()
