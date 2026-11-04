import "./style.css";

// Date of the earliest photo in the evidence log.
const FIRST_SIGHTING = new Date("2024-02-19T06:58:42Z");

function updateCounter() {
  const el = document.getElementById("days");
  if (!el) return;
  const days = Math.floor((Date.now() - FIRST_SIGHTING.getTime()) / 86_400_000);
  el.textContent = days.toLocaleString("en-AU");
}

/** Placeholder "trickle": droplets meandering down the screen like gutter water. */
function startFlow(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  type Drop = { x: number; y: number; vy: number; phase: number; r: number };
  let drops: Drop[] = [];
  let w = 0, h = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 9000);
    drops = Array.from({ length: count }, () => spawn(Math.random() * h));
  };

  const spawn = (y = -10): Drop => ({
    x: Math.random() * w,
    y,
    vy: 0.4 + Math.random() * 1.2,
    phase: Math.random() * Math.PI * 2,
    r: 0.8 + Math.random() * 1.8,
  });

  const tick = (t: number) => {
    // Fade previous frame for trails.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(150, 200, 225, 0.55)";

    for (const d of drops) {
      d.y += d.vy;
      d.x += Math.sin(t / 900 + d.phase + d.y / 60) * 0.35;
      if (d.y > h + 10) Object.assign(d, spawn());
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
}

// Meeting ends 9 Nov 2026, 6pm Adelaide time (ACDT, UTC+10:30).
const MEETING_END = new Date("2026-11-09T18:00:00+10:30");

function updateMeetingStatus() {
  if (Date.now() < MEETING_END.getTime()) return;
  document.querySelectorAll<HTMLElement>("[data-upcoming]").forEach((el) => (el.hidden = true));
  document.querySelectorAll<HTMLElement>("[data-past]").forEach((el) => (el.hidden = false));
}

updateCounter();
updateMeetingStatus();

const canvas = document.querySelector<HTMLCanvasElement>(".hero__flow");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (canvas && !reduceMotion) startFlow(canvas);

// Gift shop: every item is permanently out of stock.
const SOLD_OUT = [
  "Sold out: stock washed down to Myra St",
  "Sold out: awaiting EPA approval",
  "Sold out: referred to Council",
  "Sold out: collected in the gutter",
];
document.querySelectorAll<HTMLButtonElement>(".product__btn").forEach((btn, i) => {
  btn.addEventListener("click", () => {
    btn.textContent = SOLD_OUT[i % SOLD_OUT.length];
    btn.classList.add("is-soldout");
    btn.disabled = true;
  });
});
