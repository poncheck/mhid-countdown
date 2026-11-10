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

// ====== "Dodaj do kalendarza" ======
// Przypomnienie o starcie przedsprzedaży (nie o samej imprezie)
function formatUTC(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

const calEventTitle = "Przedsprzedaż biletów — My Head Is Dubby 20 Years";
const calEventDetails = "Start ostatniej puli biletów online na 20 Years of My Head Is Dubby. Kup bilet: " + BUY_URL;
const calEventLocation = "Online — " + BUY_URL;

const calStart = formatUTC(PRESALE_START);
const calEnd = formatUTC(PRESALE_END);

// Google Calendar link
const googleCalUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent(calEventTitle) +
  "&dates=" + calStart + "/" + calEnd +
  "&details=" + encodeURIComponent(calEventDetails) +
  "&location=" + encodeURIComponent(calEventLocation);

const calGoogleLink = document.getElementById("cal-google");
if (calGoogleLink) calGoogleLink.href = googleCalUrl;

// .ics file (Apple Calendar / Outlook)
const icsContent = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//MyHeadIsDubby//Countdown//PL",
  "BEGIN:VEVENT",
  "UID:" + Date.now() + "@myheadisdubby.com",
  "DTSTAMP:" + formatUTC(new Date()),
  "DTSTART:" + calStart,
  "DTEND:" + calEnd,
  "SUMMARY:" + calEventTitle,
  "DESCRIPTION:" + calEventDetails,
  "LOCATION:" + calEventLocation,
  "END:VEVENT",
  "END:VCALENDAR"
].join("\r\n");

const calIcsLink = document.getElementById("cal-ics");
if (calIcsLink) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  calIcsLink.href = URL.createObjectURL(blob);
}

// Toggle dropdown menu
const calendarBtn = document.getElementById("calendar-btn");
const calendarMenu = document.getElementById("calendar-menu");

if (calendarBtn && calendarMenu) {
  calendarBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    calendarMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!calendarMenu.contains(e.target) && e.target !== calendarBtn) {
      calendarMenu.classList.add("hidden");
    }
  });
}
