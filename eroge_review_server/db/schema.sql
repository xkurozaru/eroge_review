-- Atlas managed schema (initial scaffold)
-- NOTE: This SQL is written for PostgreSQL.

CREATE TABLE IF NOT EXISTS game_spec (
    id CHAR(32) PRIMARY KEY,
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    release_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_review (
    id CHAR(32) PRIMARY KEY,
    game_spec_id CHAR(32) NOT NULL UNIQUE REFERENCES game_spec(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    potential_score INTEGER NOT NULL,
    rating_score INTEGER,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    body TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
