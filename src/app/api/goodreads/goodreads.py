import json
import os
import re
from urllib.parse import urlencode, urlparse, parse_qs, urlunparse
import feedparser
import requests
from bs4 import BeautifulSoup

rss_url = os.getenv("GOODREADS_RSS_URL")


def build_rss_url(shelf):
    if not rss_url:
        raise ValueError("Missing GOODREADS_RSS_URL environment variable.")

    parsed = urlparse(rss_url)
    query = parse_qs(parsed.query)
    query["shelf"] = [shelf]
    updated_query = urlencode(query, doseq=True)
    return urlunparse(
        (parsed.scheme, parsed.netloc, parsed.path, parsed.params, updated_query, parsed.fragment)
    )

def fetch_goodreads_data(shelf):
    target_url = build_rss_url(shelf)

    response = requests.get(
        target_url,
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
        if not author:
            author_detail = entry.get("author_detail") or {}
            author = author_detail.get("name")

        if not author:
            authors = entry.get("authors") or []
            if authors:
                author = authors[0].get("name")

        if not author:
            author = entry.get("author_name")

        if not author:
            summary_html = entry.get("summary") or ""
            summary_text = BeautifulSoup(summary_html, "html.parser").get_text(" ")
            match = re.search(r"\bby\s+([^|\n]+)", summary_text, re.IGNORECASE)
            if match:
                author = match.group(1).strip()

        if not author:
            summary_html = entry.get("summary") or ""
            summary_text = BeautifulSoup(summary_html, "html.parser").get_text(" ")
            match = re.search(r"author:\s*([^\n]+)", summary_text, re.IGNORECASE)
            if match:
                author = match.group(1).strip()

        if not author and " by " in title:
            title_parts = title.rsplit(" by ", 1)
            if len(title_parts) == 2:
                title = title_parts[0].strip()
                author = title_parts[1].strip()
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
        currently_reading = fetch_goodreads_data("currently-reading")
        recently_read = fetch_goodreads_data("read")
        print(
            json.dumps(
                {
                    "currentlyReading": currently_reading,
                    "recentlyRead": recently_read,
                }
            )
        )
    except Exception as error:
        print(json.dumps({"error": str(error)}))
