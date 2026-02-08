from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import os
import sys
from pathlib import Path
import threading
import time

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
sys.path.append(str(PROJECT_ROOT / "src" / "api" / "goodreads"))
sys.path.append(str(PROJECT_ROOT / "src" / "api" / "letterboxd"))

from goodreads import fetch_goodreads_data  
from letterboxd import fetch_letterboxd_data

app = FastAPI()

cache = {
    "goodreads": {"timestamp": None, "data": None},
    "letterboxd": {"timestamp": None, "data": None},
}


cache_timezone = os.getenv("CACHE_TIMEZONE", "UTC")


def get_timezone():
    try:
        return ZoneInfo(cache_timezone)
    except Exception:
        return ZoneInfo("UTC")


def current_cache_date():
    return datetime.now(get_timezone()).strftime("%Y-%m-%d")


def refresh_goodreads():
    today = current_cache_date()
    data = {
        "currentlyReading": fetch_goodreads_data("currently-reading"),
        "recentlyRead": fetch_goodreads_data("read"),
    }
    cache["goodreads"] = {"timestamp": today, "data": data}
    return data


def refresh_letterboxd():
    today = current_cache_date()
    data = {"films": fetch_letterboxd_data()}
    cache["letterboxd"] = {"timestamp": today, "data": data}
    return data


def refresh_all():
    try:
        refresh_goodreads()
    except Exception:
        pass
    try:
        refresh_letterboxd()
    except Exception:
        pass


def seconds_until_next_midnight():
    now = datetime.now(get_timezone())
    next_midnight = (now + timedelta(days=1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    return max(0, int((next_midnight - now).total_seconds()))


def scheduler_loop():
    refresh_all()
    while True:
        time.sleep(seconds_until_next_midnight())
        refresh_all()


@app.on_event("startup")
def start_scheduler():
    thread = threading.Thread(target=scheduler_loop, daemon=True)
    thread.start()

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
        cached = cache["goodreads"]
        today = current_cache_date()
        if cached["data"] and cached["timestamp"] == today:
            return cached["data"]

        return refresh_goodreads()
    except Exception as error:
        cached = cache["goodreads"]
        if cached["data"]:
            return cached["data"]
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/letterboxd")
def letterboxd():
    try:
        cached = cache["letterboxd"]
        today = current_cache_date()
        if cached["data"] and cached["timestamp"] == today:
            return cached["data"]

        return refresh_letterboxd()
    except Exception as error:
        cached = cache["letterboxd"]
        if cached["data"]:
            return cached["data"]
        raise HTTPException(status_code=500, detail=str(error))
