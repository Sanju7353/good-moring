/* =========================================================
   Good Morning, Muskan ☀️  —  interactions
   ========================================================= */
(function () {
  "use strict";

  const NAME = (window.APP_DATA && window.APP_DATA.name) || "Sunshine";

  /* ---------- Live clock + greeting ---------- */
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");
  const greetingEl = document.getElementById("greeting");

  function greetingFor(hour) {
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  }

  function tick() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = ((h + 11) % 12) + 1;
    if (clockEl) clockEl.textContent = `${h12}:${m} ${ampm}`;
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString(undefined, {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
    }
    if (greetingEl) greetingEl.textContent = greetingFor(h);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Typing subtitle ---------- */
  const typedEl = document.getElementById("typed");
  const lines = [
    `A little sunrise, made just for you.`,
    `Hope today is as lovely as you are, ${NAME}.`,
    `Sending you the warmest good-morning wish. 🌸`,
    `You make even the sun look ordinary. ☀️`,
  ];
  let li = 0, ci = 0, deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const full = lines[li];
    if (!deleting) {
      ci++;
      if (ci > full.length) { deleting = true; setTimeout(typeLoop, 1700); return; }
    } else {
      ci--;
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
    }
    typedEl.innerHTML = full.slice(0, ci) + '<span class="cursor">|</span>';
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ---------- Floating particles ---------- */
  const particles = document.getElementById("particles");
  if (particles && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const count = window.innerWidth < 600 ? 22 : 38;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = 3 + Math.random() * 7;
      p.style.width = p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "vw";
      p.style.animationDuration = 9 + Math.random() * 12 + "s";
      p.style.animationDelay = -Math.random() * 12 + "s";
      p.style.opacity = 0.3 + Math.random() * 0.6;
      particles.appendChild(p);
    }
  }

  /* ---------- 3D Coverflow gallery (manual only, no autoplay) ---------- */
  const photos = (window.APP_DATA && window.APP_DATA.photos) || [];
  const coverflow = document.getElementById("coverflow");
  const stage = document.getElementById("cfStage");
  const cards = stage ? Array.from(stage.children) : [];
  const dotsEl = document.getElementById("dots");
  const counterEl = document.getElementById("counter");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let current = 0;

  function layout() {
    if (!cards.length) return;
    const spread = (cards[0].offsetWidth || 200) * 0.6;
    cards.forEach((card, i) => {
      const offset = i - current;
      const abs = Math.abs(offset);
      const sign = Math.sign(offset);
      card.classList.toggle("is-active", offset === 0);
      if (abs > 3) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.transform =
          `translate(-50%,-50%) translateX(${sign * 640}px) rotateY(${-sign * 55}deg) scale(.55)`;
        return;
      }
      const tx = offset * spread;
      const tz = -abs * 170;
      const rot = -sign * 46;
      const scale = 1 - abs * 0.11;
      card.style.opacity = abs > 2 ? "0.3" : "1";
      card.style.pointerEvents = "auto";
      card.style.zIndex = String(100 - abs);
      card.style.filter = offset === 0 ? "none" : "brightness(.72) saturate(.9)";
      card.style.transform =
        `translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${rot}deg) scale(${scale})`;
    });
    Array.from(dotsEl.children).forEach((d, idx) =>
      d.classList.toggle("active", idx === current)
    );
    if (counterEl) counterEl.textContent = String(current + 1);
  }

  function goTo(i) {
    current = Math.max(0, Math.min(cards.length - 1, i));
    layout();
  }

  if (cards.length) {
    // dots
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", "Go to photo " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(dot);
    });

    prevBtn && prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener("click", () => goTo(current + 1));

    // click a card: side card -> bring to center, center card -> open lightbox
    let dragged = false;
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (dragged) return;
        const idx = Number(card.dataset.index);
        if (idx === current) openLightbox(current);
        else goTo(idx);
      });
    });

    // drag / swipe with the pointer
    let startX = 0, startY = 0, downIdx = current, dragging = false;
    coverflow.addEventListener("pointerdown", (e) => {
      dragging = true; dragged = false;
      startX = e.clientX; startY = e.clientY; downIdx = current;
    });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 10) dragged = true;
    });
    window.addEventListener("pointerup", (e) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        const spread = (cards[0].offsetWidth || 200) * 0.6;
        const steps = Math.max(1, Math.min(3, Math.round(Math.abs(dx) / spread)));
        goTo(downIdx + (dx < 0 ? steps : -steps));
      }
    });

    // keyboard arrows
    window.addEventListener("keydown", (e) => {
      if (lbOpen) return; // lightbox handles its own keys
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    });

    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    // initial paint (and again shortly after, once fonts/images settle sizes)
    layout();
    setTimeout(layout, 120);
  }

  /* ---------- Full-screen lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCounter = document.getElementById("lbCounter");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  let lbIndex = 0;
  let lbOpen = false;

  function showLb(i) {
    lbIndex = (i + photos.length) % photos.length;
    if (lbImg) lbImg.src = photos[lbIndex];
    if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${photos.length}`;
  }
  function openLightbox(i) {
    if (!lightbox || !photos.length) return;
    showLb(i);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lbOpen = true;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lbOpen = false;
    document.body.style.overflow = "";
    goTo(lbIndex); // keep the coverflow in sync with what they last viewed
  }

  if (lightbox) {
    lbClose && lbClose.addEventListener("click", closeLightbox);
    lbPrev && lbPrev.addEventListener("click", (e) => { e.stopPropagation(); showLb(lbIndex - 1); });
    lbNext && lbNext.addEventListener("click", (e) => { e.stopPropagation(); showLb(lbIndex + 1); });
    // click the dark backdrop (not the image) to close
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lb-figure")) closeLightbox();
    });
    window.addEventListener("keydown", (e) => {
      if (!lbOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
    });
    // swipe inside the lightbox
    let lbStartX = 0, lbDown = false;
    lightbox.addEventListener("pointerdown", (e) => { lbDown = true; lbStartX = e.clientX; });
    lightbox.addEventListener("pointerup", (e) => {
      if (!lbDown) return; lbDown = false;
      const dx = e.clientX - lbStartX;
      if (Math.abs(dx) > 40) showLb(lbIndex + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- Sweet message rotator ---------- */
  const messageEl = document.getElementById("message");
  const newMsgBtn = document.getElementById("newMsgBtn");

  async function loadMessage() {
    if (!messageEl) return;
    try {
      const res = await fetch("/api/message");
      const data = await res.json();
      messageEl.style.opacity = 0;
      setTimeout(() => {
        messageEl.textContent = data.message;
        messageEl.style.opacity = 1;
      }, 250);
    } catch (e) {
      messageEl.textContent = `Good morning, ${NAME}. Have a beautiful day. ☀️`;
    }
  }
  loadMessage();
  newMsgBtn && newMsgBtn.addEventListener("click", loadMessage);
  // gently auto-rotate the message too
  setInterval(loadMessage, 9000);

  /* ---------- Floating hearts ---------- */
  const HEARTS = ["💗", "💛", "🌸", "✨", "💕", "🌷", "☀️", "💖"];
  function burstHearts(x, y, n) {
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      h.className = "float-heart";
      h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      h.style.left = x + (Math.random() * 80 - 40) + "px";
      h.style.top = y + "px";
      h.style.setProperty("--r", Math.random() * 60 - 30 + "deg");
      h.style.animationDelay = Math.random() * 0.25 + "s";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 2800);
    }
  }

  const heartBtn = document.getElementById("heartBtn");
  heartBtn && heartBtn.addEventListener("click", (e) => {
    const r = heartBtn.getBoundingClientRect();
    burstHearts(r.left + r.width / 2, r.top, 14);
  });

  // tap anywhere for a little sparkle (ignore taps on buttons/links)
  document.addEventListener("click", (e) => {
    if (e.target.closest("button, a")) return;
    burstHearts(e.clientX, e.clientY, 5);
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
