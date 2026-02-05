import json
import os
import re
import feedparser
import requests
from bs4 import BeautifulSoup

rss_url = os.getenv("LETTERBOXD_RSS_URL")


def fetch_letterboxd_data():
	if not rss_url:
		raise ValueError("Missing LETTERBOXD_RSS_URL environment variable.")

	response = requests.get(
		rss_url,
		headers={
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
		},
		timeout=20,
		allow_redirects=True,
	)
	response.raise_for_status()

	feed = feedparser.parse(response.content)

	if getattr(feed, "bozo", False):
		raise ValueError("Failed to parse Letterboxd RSS feed.")

	films = []
	for entry in feed.entries:
		title = entry.get("title", "Untitled")
		link = entry.get("link")
		summary_html = entry.get("summary") or ""
		soup = BeautifulSoup(summary_html, "html.parser")

		poster = None
		image = soup.find("img")
		if image and image.get("src"):
			poster = image.get("src")

		rating = None
		summary_text = soup.get_text(" ")
		match = re.search(r"Rated\s*:\s*([★½]+)", summary_text)
		if match:
			rating = match.group(1).strip()

		films.append(
			{
				"title": title,
				"link": link,
				"posterUrl": poster,
				"rating": rating,
			}
		)

	return films


if __name__ == "__main__":
	try:
		films = fetch_letterboxd_data()
		print(json.dumps({"films": films}))
	except Exception as error:
		print(json.dumps({"error": str(error)}))
