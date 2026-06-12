"""
Good Morning Muskan — a little FastAPI website to start her day with a smile. 🌅
Run locally:   uvicorn main:app --reload
"""

import datetime
import random
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# --- Personalise here -------------------------------------------------------
HER_NAME = "Muskan"
# Photos listed here show first (in this order); the rest follow alphabetically.
FEATURED_PHOTOS = ["IMG-20260611-WA0021.jpg"]
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
IMAGES_DIR = BASE_DIR / "static" / "images"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

app = FastAPI(title=f"Good Morning {HER_NAME}")

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=BASE_DIR / "templates")

# Sweet rotating messages shown one at a time on the page.
MESSAGES = [
    "Good morning, Muskan. The sun came up, but you still light up the sky brighter. ☀️",
    "Every morning I get is better just knowing you're in this world. 🌸",
    "Rise and shine, sunshine. The whole day is lucky it gets to meet you.",
    "If mornings had a face, it would smile like you do, Muskan. 😊",
    "Coffee is nice, but waking up to thoughts of you is sweeter. ☕💛",
    "May your day be as soft, beautiful, and bright as you are.",
    "Some people wake up to alarms — I'd happily wake up to your smile.",
    "A new morning, a new chance to tell you how special you are. 🌷",
    "The flowers turned to face the sun, then they saw you and got jealous.",
    "Good morning to the girl who makes ordinary days feel like something special.",
    "Wishing you a morning full of soft light, warm chai, and zero worries. 🍵",
    "You're the first happy thought of my morning and the last one at night.",
    "Hope today is gentle with you — you deserve all the good things, Muskan. ✨",
    "Mornings are proof that even the sky dresses up beautifully for you. 🌄",
    "Stretch, smile, and shine — the world's been waiting for your light today.",
]


def list_photos() -> list[str]:
    """Return web paths for images in static/images.

    Any names in FEATURED_PHOTOS come first (in that order); the rest follow
    alphabetically.
    """
    if not IMAGES_DIR.exists():
        return []
    all_names = sorted(
        p.name for p in IMAGES_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    )
    featured = [n for n in FEATURED_PHOTOS if n in all_names]
    rest = [n for n in all_names if n not in featured]
    ordered = featured + rest
    return [f"/static/images/{name}" for name in ordered]


def time_greeting(hour: int) -> str:
    if 5 <= hour < 12:
        return "Good Morning"
    if 12 <= hour < 17:
        return "Good Afternoon"
    if 17 <= hour < 21:
        return "Good Evening"
    return "Good Night"


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "name": HER_NAME,
            "photos": list_photos(),
            "year": datetime.date.today().year,
        },
    )


@app.get("/api/photos")
async def api_photos():
    return {"photos": list_photos()}


@app.get("/api/message")
async def api_message():
    return {"message": random.choice(MESSAGES)}


@app.get("/api/greeting")
async def api_greeting():
    now = datetime.datetime.now()
    return JSONResponse(
        {
            "greeting": time_greeting(now.hour),
            "name": HER_NAME,
            "time": now.strftime("%I:%M %p"),
            "date": now.strftime("%A, %d %B %Y"),
        }
    )


@app.get("/health")
async def health():
    return {"status": "ok"}
