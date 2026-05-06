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


def start_of_month(*, month: date, tz: ZoneInfo = JST) -> datetime:
    return datetime.combine(month.replace(day=1), time(0, 0), tzinfo=tz)


def end_of_month(*, month: date, tz: ZoneInfo = JST) -> datetime:
    """Exclusive end boundary for the given month in the given timezone."""

    month_start = month.replace(day=1)
    if month_start.month == 12:
        next_month = month_start.replace(year=month_start.year + 1, month=1, day=1)
    else:
        next_month = month_start.replace(month=month_start.month + 1, day=1)
    return datetime.combine(next_month, time(0, 0), tzinfo=tz)
