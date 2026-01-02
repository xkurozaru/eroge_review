-- Atlas managed schema (initial scaffold)
-- NOTE: This SQL is written for PostgreSQL.

CREATE TABLE IF NOT EXISTS game_spec (
    id CHAR(36) PRIMARY KEY,
    title TEXT NOT NULL,
    brand TEXT
);
