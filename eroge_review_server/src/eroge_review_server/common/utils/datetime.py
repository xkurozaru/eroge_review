from __future__ import annotations

from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

JST = ZoneInfo("Asia/Tokyo")


def now(*, tz: ZoneInfo = JST) -> datetime:
    return datetime.now(tz=tz)


def start_of_day(*, day: date, tz: ZoneInfo = JST) -> datetime:
    return datetime.combine(day, time(0, 0), tzinfo=tz)


def end_of_day(*, day: date, tz: ZoneInfo = JST) -> datetime:
    """Exclusive end boundary for the given day in the given timezone."""

    return datetime.combine(day + timedelta(days=1), time(0, 0), tzinfo=tz)
