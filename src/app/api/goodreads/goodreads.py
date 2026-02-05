import json
import os
import feedparser
import requests

rss_url = os.getenv("GOODREADS_RSS_URL")

def fetch_goodreads_data():
    if not rss_url:
        raise ValueError("Missing GOODREADS_RSS_URL environment variable.")

    response = requests.get(
        rss_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
        },
        timeout=20,
        allow_redirects=True,
    )
    response.raise_for_status()

    if "user/sign_in" in response.url:
        raise ValueError(
            "Goodreads RSS is redirecting to sign-in. Use the private RSS URL from Goodreads (list_rss) with your key."
        )

    feed = feedparser.parse(response.content)

    if getattr(feed, "bozo", False):
        raise ValueError("Failed to parse Goodreads RSS feed.")

    book_data = []
    for entry in feed.entries:
        title = entry.get("title", "Untitled")
        author = entry.get("author")
        cover_url = None

        for link in entry.get("links", []):
            if link.get("type", "").startswith("image/"):
                cover_url = link.get("href")
                break

        if not cover_url:
            cover_url = entry.get("book_large_image_url") or entry.get(
                "book_medium_image_url"
            )

        book_data.append(
            {
                "title": title,
                "author": author,
                "coverUrl": cover_url,
            }
        )

    return book_data


if __name__ == "__main__":
    try:
        books = fetch_goodreads_data()
        print(json.dumps({"books": books}))
    except Exception as error:
        print(json.dumps({"error": str(error)}))
