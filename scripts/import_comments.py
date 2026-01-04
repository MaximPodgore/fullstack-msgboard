import json
import os
import psycopg2
from psycopg2.extras import execute_batch

DB_NAME = os.getenv("PGDATABASE", "msgboard")
DB_USER = os.getenv("PGUSER", "postgres")
DB_PASSWORD = os.getenv("PGPASSWORD", "postgres")
DB_HOST = os.getenv("PGHOST", "localhost")
DB_PORT = os.getenv("PGPORT", "5432")

ROOT = os.path.dirname(os.path.dirname(__file__))
COMMENTS_PATH = os.path.join(ROOT, "comments.json")

UPSERT_SQL = """
INSERT INTO public.comments (id, author, text, date, likes, image)
VALUES (%s, %s, %s, %s, %s, %s)
ON CONFLICT (id) DO UPDATE SET
  author = EXCLUDED.author,
  text = EXCLUDED.text,
  date = EXCLUDED.date,
  likes = EXCLUDED.likes,
  image = EXCLUDED.image;
"""


def main():
    with open(COMMENTS_PATH, "r", encoding="utf-8") as f:
        payload = json.load(f)
    comments = payload.get("comments", [])

    rows = []
    for c in comments:
        img = c.get("image") or None
        # Ensure types are sensible
        try:
            cid = int(c.get("id"))
        except Exception:
            # fall back to None to let DB error out clearly
            cid = None
        rows.append((
            cid,
            c.get("author"),
            c.get("text"),
            c.get("date"),  # Postgres can parse ISO8601 strings
            int(c.get("likes", 0)),
            img,
        ))

    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
    )
    try:
        with conn:
            with conn.cursor() as cur:
                execute_batch(cur, UPSERT_SQL, rows, page_size=100)
        print(f"Imported {len(rows)} comments into '{DB_NAME}'.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
