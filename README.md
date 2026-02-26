# Portfolio

Hey! This is my personal portfolio, built with Next.js. It’s a small, fast site that pulls my recent reads from Goodreads and my recent watches from Letterboxd.

## Requirements
- Node.js 20+
- Python 3.12+ (only if you want to run the scraper service locally)

## Local development
```bash
npm install
npm run dev
```

## Environment variables
Create a `.env.local` file in the project root:

```
SCRAPER_SERVICE_URL=https://<your-render-service>.onrender.com
```

## Scraper service (Render)
I use a tiny Python service for scraping Goodreads and Letterboxd. The Next.js app just proxies requests to it.

### Service env vars (Render)
- `GOODREADS_RSS_URL`
- `LETTERBOXD_RSS_URL`

### Render settings
- **Root Directory**: `scraper-service`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

## API routes
- `GET /api/goodreads`
- `GET /api/letterboxd`

## Build
```bash
npm run build
```
# portfolio
