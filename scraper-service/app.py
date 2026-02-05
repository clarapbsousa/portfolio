from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
sys.path.append(str(PROJECT_ROOT / "src" / "api" / "goodreads"))
sys.path.append(str(PROJECT_ROOT / "src" / "api" / "letterboxd"))

from goodreads import fetch_goodreads_data  
from letterboxd import fetch_letterboxd_data

app = FastAPI()

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
        return {
            "currentlyReading": fetch_goodreads_data("currently-reading"),
            "recentlyRead": fetch_goodreads_data("read"),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/letterboxd")
def letterboxd():
    try:
        return {"films": fetch_letterboxd_data()}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
