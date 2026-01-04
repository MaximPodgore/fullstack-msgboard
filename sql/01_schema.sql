-- Initial schema for msgboard
CREATE TABLE IF NOT EXISTS public.comments (
    id INTEGER PRIMARY KEY,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    likes INTEGER NOT NULL,
    image TEXT
);
