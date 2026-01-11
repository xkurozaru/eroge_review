from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import yaml


def load_app(which: str):
    if which == "showcase":
        from eroge_review_server.showcase.server import app  # type: ignore

        return app
    if which == "console":
        from eroge_review_server.console.server import app  # type: ignore

        return app
    raise ValueError(f"Unknown app: {which}")


def _dump_json(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def _dump_yaml(data: Any) -> str:
    return yaml.safe_dump(
        data,
        allow_unicode=True,
        sort_keys=False,
        width=120,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Export FastAPI OpenAPI schema to a file.")
    parser.add_argument("--app", choices=["showcase", "console"], required=True)
    parser.add_argument("--out", type=str, required=True, help="Output file path (.json/.yaml).")
    parser.add_argument("--format", choices=["json", "yaml"], default=None)
    args = parser.parse_args()

    app = load_app(args.app)
    schema = app.openapi()

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    fmt = args.format
    if fmt is None:
        fmt = "yaml" if out_path.suffix.lower() in {".yml", ".yaml"} else "json"

    if fmt == "yaml":
        out_path.write_text(_dump_yaml(schema), encoding="utf-8")
        return 0

    out_path.write_text(_dump_json(schema), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
