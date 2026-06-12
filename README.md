# Good Morning, Muskan ☀️

A small, professional, mobile-friendly website that wishes Muskan a good morning —
animated sunrise, a photo slideshow, a live clock, rotating sweet messages, and
floating hearts. Built with **FastAPI + HTML + CSS + JavaScript**.

---

## ▶️ Run it on your computer (Windows / PowerShell)

Open PowerShell **in this folder** (`C:\Sanjay Swamy\MG`) and run:

```powershell
# 1. Activate the virtual environment (already created for you)
.\venv\Scripts\Activate.ps1

# 2. Start the website
uvicorn main:app --reload
```

Then open your browser at **http://127.0.0.1:8000**

> First time only: if the `venv` folder is missing, create it with
> `python -m venv venv` then `pip install -r requirements.txt`.

To see it from your **phone on the same Wi‑Fi**, run instead:
```powershell
uvicorn main:app --host 0.0.0.0 --port 8000
```
and open `http://<your-PC-IP>:8000` on the phone (find the IP with `ipconfig`).

Stop the server anytime with **Ctrl + C**.

---

## 🌐 Put it online & share the link (so it works tomorrow, anywhere)

The easiest free option is **Render**:

1. Create a free GitHub account and a new repo, then upload this whole folder
   (everything **except** the `venv` folder — `.gitignore` already skips it).
2. Go to <https://render.com> → sign in with GitHub → **New ➜ Web Service**.
3. Pick this repo. Render auto-detects the settings from `render.yaml`:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **Deploy**. In ~2 minutes you get a public link like
   `https://good-morning-muskan.onrender.com` — that's the link you send her. 💌

> Free Render services sleep after inactivity, so the very first open of the day
> may take ~30 seconds to wake up. That's normal.

Railway (<https://railway.app>) works the same way using the included `Procfile`.

---

## ✏️ Change things

- **Her name** — edit `HER_NAME` at the top of `main.py`.
- **The sweet messages** — edit the `MESSAGES` list in `main.py`.
- **The typed lines / hearts** — edit `static/js/script.js`.
- **Colours & look** — edit `static/css/style.css` (`:root` at the top).
- **Photos** — add/remove images in `static/images/`. They appear automatically.

---

## 📁 Project structure

```
MG/
├── main.py              FastAPI app (routes + messages)
├── requirements.txt     Python dependencies
├── Procfile             Start command for hosting
├── render.yaml          One-click Render deploy config
├── runtime.txt          Python version for hosting
├── templates/
│   └── index.html       The page
└── static/
    ├── css/style.css    Styles + animations
    ├── js/script.js     Clock, slideshow, hearts, messages
    └── images/          Muskan's photos (22)
```
