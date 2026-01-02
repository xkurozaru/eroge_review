from fastapi import FastAPI


def create_app() -> FastAPI:
    # NOTE: console server is reserved for internal/admin style endpoints.
    # Keep minimal scaffold for now.
    return FastAPI(title="Eroge Review Console Server")


app = create_app()
