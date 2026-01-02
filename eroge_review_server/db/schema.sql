-- Atlas managed schema (initial scaffold)
-- NOTE: This SQL is written for PostgreSQL.

CREATE TABLE IF NOT EXISTS game_spec (
    id CHAR(32) PRIMARY KEY,
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    release_date DATE NOT NULL
);
