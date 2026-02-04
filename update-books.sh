#!/bin/bash
# Update books.json with current Goodreads data
# Usage: ./update-books.sh

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required to run this script"
    exit 1
fi

# Goodreads user ID (change this to your user ID)
GOODREADS_USER_ID="clarapbsousa"

# Output file
OUTPUT_FILE="public/books.json"

echo "Fetching books from Goodreads for user: $GOODREADS_USER_ID"

# Run the Python script and save output
if python3 goodreads.py "$GOODREADS_USER_ID" > "$OUTPUT_FILE"; then
    echo "Successfully updated $OUTPUT_FILE"
    echo "Books fetched:"
    cat "$OUTPUT_FILE"
else
    echo "Error: Failed to fetch books from Goodreads"
    echo "Make sure you have internet access and the correct user ID"
    exit 1
fi
