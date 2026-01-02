import argparse
import json
from pathlib import Path


def load_app(which: str):
    if which == "controller":
        from eroge_review_server.controller.server import app  # type: ignore

        return app
    if which == "console":
        from eroge_review_server.console.server import app  # type: ignore

        return app
    raise ValueError(f"Unknown app: {which}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Export FastAPI OpenAPI schema to a file.")
    parser.add_argument("--app", choices=["controller", "console"], required=True)
    parser.add_argument("--out", type=str, required=True, help="Output path (JSON).")
    args = parser.parse_args()

    app = load_app(args.app)
    schema = app.openapi()

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(schema, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
