from __future__ import annotations

import os


def _create_app():
    app = os.getenv("EROGE_REVIEW_APP").strip().lower()

    if app == "console":
        from eroge_review_server.console.server import create_app as create_console_app

        return create_console_app()

    if app == "showcase":
        from eroge_review_server.showcase.server import create_app as create_showcase_app

        return create_showcase_app()

    raise RuntimeError(f"Invalid EROGE_REVIEW_APP. Expected 'console' or 'showcase'. Got: {app!r}")


app = _create_app()
