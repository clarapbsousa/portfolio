from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from pathlib import Path
import time

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
sys.path.append(str(PROJECT_ROOT / "src" / "api" / "goodreads"))
sys.path.append(str(PROJECT_ROOT / "src" / "api" / "letterboxd"))

from goodreads import fetch_goodreads_data  
from letterboxd import fetch_letterboxd_data

app = FastAPI()

cache = {
    "goodreads": {"timestamp": 0.0, "data": None},
    "letterboxd": {"timestamp": 0.0, "data": None},
}
goodreads_ttl = int(os.getenv("GOODREADS_CACHE_TTL", "600"))
letterboxd_ttl = int(os.getenv("LETTERBOXD_CACHE_TTL", "600"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/goodreads")
def goodreads():
    try:
        now = time.time()
        cached = cache["goodreads"]
        if cached["data"] and now - cached["timestamp"] < goodreads_ttl:
            return cached["data"]

        data = {
            "currentlyReading": fetch_goodreads_data("currently-reading"),
            "recentlyRead": fetch_goodreads_data("read"),
        }
        cache["goodreads"] = {"timestamp": now, "data": data}
        return data
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/letterboxd")
def letterboxd():
    try:
        now = time.time()
        cached = cache["letterboxd"]
        if cached["data"] and now - cached["timestamp"] < letterboxd_ttl:
            return cached["data"]

        data = {"films": fetch_letterboxd_data()}
        cache["letterboxd"] = {"timestamp": now, "data": data}
        return data
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
