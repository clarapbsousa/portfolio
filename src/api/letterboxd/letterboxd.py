import json
import os
import re
from concurrent.futures import ThreadPoolExecutor
import feedparser
import requests
from bs4 import BeautifulSoup

rss_url = os.getenv("LETTERBOXD_RSS_URL")


def fetch_letterboxd_data():
	if not rss_url:
		raise ValueError("Missing LETTERBOXD_RSS_URL environment variable.")

	session = requests.Session()
	response = session.get(
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
	film_urls = []
	max_entries = 4
	for entry in feed.entries[:max_entries]:
		title = entry.get("title", "Untitled")
		rating = None
		title_parts = title.split(" - ")
		if len(title_parts) > 1:
			title = " - ".join(title_parts[:-1]).strip()
			last_part = title_parts[-1]
			rating_match = re.search(r"[★½]+", last_part)
			if rating_match:
				rating = rating_match.group(0)

		title = re.sub(r",\s*\d{4}$", "", title).strip()
		link = entry.get("link")
		summary_html = entry.get("summary") or ""
		soup = BeautifulSoup(summary_html, "html.parser")

		poster = None
		image = soup.find("img")
		if image and image.get("src"):
			poster = image.get("src")

		director = None
		film_url = link
		if link:
			match = re.match(r"^https?://letterboxd\.com/[^/]+/film/([^/]+)/", link)
			if match:
				film_url = f"https://letterboxd.com/film/{match.group(1)}/"
		film_urls.append(film_url)

		films.append(
			{
				"title": title,
				"director": director,
				"link": link,
				"posterUrl": poster,
				"rating": rating,
			}
		)

	def fetch_director(url):
		if not url:
			return None
		try:
			film_page = session.get(
				url,
				headers={
					"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
				},
				timeout=20,
			)
			film_soup = BeautifulSoup(film_page.text, "html.parser")
			label = film_soup.find("meta", {"name": "twitter:label1"})
			data = film_soup.find("meta", {"name": "twitter:data1"})
			if label and data and label.get("content") == "Directed by":
				return data.get("content")
		except Exception:
			return None
		return None

	max_directors = 3
	with ThreadPoolExecutor(max_workers=3) as executor:
		director_results = list(executor.map(fetch_director, film_urls[:max_directors]))
	for index, director in enumerate(director_results):
		films[index]["director"] = director

	return films


if __name__ == "__main__":
	try:
		films = fetch_letterboxd_data()
		print(json.dumps({"films": films}))
	except Exception as error:
		print(json.dumps({"error": str(error)}))
