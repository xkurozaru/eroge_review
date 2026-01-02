from __future__ import annotations


class GameReviewDomainError(Exception):
    """Domain-level error for game review invariants."""


class GameReviewPublishValidationError(GameReviewDomainError):
    """Raised when attempting to publish an invalid review."""
