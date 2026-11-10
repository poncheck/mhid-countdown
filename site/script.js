// ====== CONFIG — edytuj tutaj ======
// Link do zakupu biletów (Stage24)
const BUY_URL = "https://stage24.pl/wydarzenia/protokultura-wroclaw-9649";

// Przedsprzedaż startuje: poniedziałek 16.11.2026, 08:00 czasu Warszawy (CET, UTC+1)
const PRESALE_START = new Date("2026-11-16T08:00:00+01:00");

// Przedsprzedaż trwa 48h, więc zamyka się: środa 18.11.2026, 08:00
const PRESALE_END = new Date(PRESALE_START.getTime() + 48 * 60 * 60 * 1000);
// ====================================

document.getElementById("buy-btn").href = BUY_URL;

const beforeSection = document.getElementById("before-section");
const liveSection = document.getElementById("live-section");
const soldOutSection = document.getElementById("sold-out-section");

function pad(n) {
  return String(n).padStart(2, "0");
}

function showOnly(section) {
  [beforeSection, liveSection, soldOutSection].forEach(s => s.classList.add("hidden"));
  section.classList.remove("hidden");
}

function tick() {
  const now = new Date();

  if (now < PRESALE_START) {
    // STAN 1: liczymy do startu przedsprzedaży
    showOnly(beforeSection);

    const diff = PRESALE_START - now;
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    document.getElementById("days").textContent = pad(days);
    document.getElementById("hours").textContent = pad(hours);
    document.getElementById("minutes").textContent = pad(minutes);
    document.getElementById("seconds").textContent = pad(seconds);

  } else if (now >= PRESALE_START && now < PRESALE_END) {
    // STAN 2: przedsprzedaż trwa, liczymy do zamknięcia (48h okno)
    showOnly(liveSection);

    const diff = PRESALE_END - now;
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60);

    document.getElementById("hours-live").textContent = pad(hours);
    document.getElementById("minutes-live").textContent = pad(minutes);
    document.getElementById("seconds-live").textContent = pad(seconds);

  } else {
    // STAN 3: przedsprzedaż zamknięta
    showOnly(soldOutSection);
    clearInterval(timer);
  }
}

tick();
const timer = setInterval(tick, 1000);
