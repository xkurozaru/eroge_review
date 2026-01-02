from __future__ import annotations

from dataclasses import dataclass

from fastapi import HTTPException, Query

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 200


@dataclass(frozen=True, slots=True)
class Pager:
    page: int
    page_size: int

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


def get_pager(
    page: int = Query(DEFAULT_PAGE),
    page_size: int = Query(DEFAULT_PAGE_SIZE),
) -> Pager:
    if page < 1:
        raise HTTPException(status_code=422, detail="page must be >= 1")
    if page_size < 1 or page_size > MAX_PAGE_SIZE:
        raise HTTPException(status_code=422, detail=f"page_size must be 1..{MAX_PAGE_SIZE}")
    return Pager(page=page, page_size=page_size)
