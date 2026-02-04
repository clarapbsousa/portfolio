#!/usr/bin/env python3
"""
Fetch currently reading books from Goodreads RSS feed.
Usage: python goodreads.py <goodreads_user_id>
"""

import sys
import json
import urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import quote


def fetch_goodreads_books(user_id, shelf="currently-reading"):
    """
    Fetch books from a Goodreads user's shelf via RSS feed.
    
    Args:
        user_id: Goodreads user ID or username
        shelf: Shelf name (default: "currently-reading")
    
    Returns:
        List of book dictionaries
    """
    # Goodreads RSS feed URL
    rss_url = f"https://www.goodreads.com/review/list_rss/{user_id}?shelf={shelf}"
    
    try:
        # Fetch RSS feed
        with urllib.request.urlopen(rss_url, timeout=10) as response:
            rss_data = response.read()
        
        # Parse XML
        root = ET.fromstring(rss_data)
        
        books = []
        
        # Parse items (books) from the feed
        for item in root.findall('.//item'):
            title_elem = item.find('title')
            author_elem = item.find('author_name')
            description_elem = item.find('description')
            book_id_elem = item.find('book_id')
            book_large_image_url_elem = item.find('book_large_image_url')
            user_rating_elem = item.find('user_rating')
            
            # Extract book information
            title = title_elem.text if title_elem is not None else "Unknown Title"
            author = author_elem.text if author_elem is not None else "Unknown Author"
            book_id = book_id_elem.text if book_id_elem is not None else ""
            image_url = book_large_image_url_elem.text if book_large_image_url_elem is not None else ""
            rating = user_rating_elem.text if user_rating_elem is not None else "0"
            
            # Extract description/notes from CDATA
            description = ""
            if description_elem is not None and description_elem.text:
                # Description is often in CDATA, extract plain text
                desc_text = description_elem.text
                # Simple extraction - could be enhanced with HTML parsing
                description = desc_text[:200] + "..." if len(desc_text) > 200 else desc_text
            
            book = {
                "title": title,
                "author": author,
                "book_id": book_id,
                "image_url": image_url,
                "rating": rating,
                "description": description
            }
            
            books.append(book)
        
        return books
    
    except urllib.error.URLError as e:
        print(f"Error fetching Goodreads data: {e}", file=sys.stderr)
        return []
    except ET.ParseError as e:
        print(f"Error parsing RSS feed: {e}", file=sys.stderr)
        return []
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return []


def main():
    """Main entry point for the script."""
    if len(sys.argv) < 2:
        print("Usage: python goodreads.py <goodreads_user_id>", file=sys.stderr)
        sys.exit(1)
    
    user_id = sys.argv[1]
    
    # Fetch currently reading books
    books = fetch_goodreads_books(user_id, "currently-reading")
    
    # Output as JSON
    print(json.dumps(books, indent=2))
    
    return 0 if books else 1


if __name__ == "__main__":
    sys.exit(main())
