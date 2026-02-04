# Goodreads Integration

This portfolio integrates with Goodreads to display currently reading books.

## Setup

The `goodreads.py` script fetches book data from your Goodreads account via RSS feed.

### Usage

1. **Find your Goodreads User ID:**
   - Go to your Goodreads profile
   - Your user ID is in the URL: `https://www.goodreads.com/user/show/YOUR_USER_ID`
   - Or use your username (e.g., "clarapbsousa")

2. **Update books data:**
   ```bash
   # Run the Python script directly
   python3 goodreads.py YOUR_USER_ID > public/books.json
   
   # Or use the convenience script
   ./update-books.sh
   ```

3. **The script will create/update `public/books.json`** with your currently reading books

## How it works

- `goodreads.py`: Python script that fetches data from Goodreads RSS feed
- `update-books.sh`: Convenience bash script to update the books.json file
- `public/books.json`: JSON file containing book data served to the frontend
- The Next.js app reads from `/books.json` at runtime

## Customization

- To fetch from a different shelf, modify the script to pass a different shelf parameter (e.g., "read", "to-read")
- To add more book details, parse additional fields from the RSS feed in `goodreads.py`

## Note

The Goodreads API was deprecated in 2020, so this integration uses the public RSS feed which is still available. The RSS feed provides basic book information including title, author, cover image, and user ratings.
