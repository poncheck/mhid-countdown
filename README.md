# MHID Countdown — bilety.myheadisdubby.com

Prosta strona z odliczaniem do zamknięcia przedsprzedaży biletów online na
"20 Years of My Head Is Dubby" (21.11.2026, Protokultura, Wrocław).

## Co jest w środku

- `site/index.html` — strona (PL)
- `site/style.css` — styl dopasowany do plakatu (pomarańcz/granat/neonowa zieleń/kremowy)
- `site/script.js` — logika odliczania + 3 stany (przed startem / live 48h / zamknięte)
- `site/poster.jpg` — grafika z plakatu użyta jako hero image
- `site/logo.png` — logo My Head Is Dubby (header + footer)
- `Dockerfile` — buduje obraz nginx serwujący stronę statyczną
- `nginx.conf` — konfiguracja nginx (gzip, cache)
- `docker-compose.yml` — **wersja produkcyjna**: strona na porcie **8080** (bez SSL —
  TLS i tunel obsługuje Pangolin po swojej stronie)
- `docker-compose.local.yml` — wersja do szybkich testów lokalnych na porcie 8080

## Jak to działa

Strona ma 3 stany, które przełączają się automatycznie w zależności od aktualnej daty:

1. **Przed 16.11.2026, 8:00** — licznik odliczający do startu przedsprzedaży
2. **16.11.2026 8:00 → 18.11.2026 8:00 (okno 48h)** — czerwony, pulsujący licznik
   odliczający do zamknięcia + aktywny przycisk "KUP BILET TERAZ" (link do Stage24)
3. **Po 18.11.2026, 8:00** — "bilet" z informacją, że przedsprzedaż online
   zamknięta, reszta biletów na bramce w dniu wydarzenia

Link do zakupu biletów jest już wpisany w `site/script.js` (zmienna `BUY_URL`),
nie trzeba go zmieniać.

---

## 🚀 Architektura: Pangolin + ten serwer

Ten serwer stoi **za Pangolinem** (tunel + reverse proxy, jak Cloudflare Tunnel).
Pangolin obsługuje publiczny ruch, TLS/HTTPS i tunelowanie do tej maszyny —
dlatego **nie ma tu Caddy ani własnego certyfikatu Let's Encrypt**. To
rozwiązuje problem "challenge failed" / "unrecognized name", który występował
przy próbie wystawienia certyfikatu lokalnie — Let's Encrypt nigdy nie mógł
dotrzeć do lokalnego Caddy, bo cały ruch i tak idzie przez serwer Pangolina.

**Ustawienia w dashboardzie Pangolina (Resource):**
- Domena: `bilety.myheadisdubby.com`
- Cel: ten serwer, port **8080**
- Protokół do backendu: HTTP (nie HTTPS — TLS jest terminowany przez Pangolin)

### Start
```bash
cd mhid-countdown
git pull
docker compose up -d --build
```

Strona wstaje na porcie **8080** tego serwera. Pangolin (Newt agent) musi być
już skonfigurowany, żeby kierować `bilety.myheadisdubby.com` na ten port —
jeśli dashboard Pangolina wskazuje inny port, zaktualizuj go na 8080.

### Zatrzymanie
```bash
docker compose down
```

---

## 🧪 Uruchomienie LOKALNE (szybki podgląd na tym samym komputerze)

```bash
cd mhid-countdown
docker compose -f docker-compose.local.yml up -d --build
```

Strona będzie dostępna pod: **http://localhost:8080**

Zatrzymanie:
```bash
docker compose -f docker-compose.local.yml down
```

(Uwaga: `docker-compose.yml` i `docker-compose.local.yml` używają tego samego
portu 8080 — nie odpalaj obu jednocześnie na tej samej maszynie, drugi po
prostu nie wstanie, bo port będzie zajęty.)

## Do zrobienia przed publikacją

- [x] Link do zakupu biletów (Stage24) wpisany w `site/script.js`
- [x] Zdjęty Caddy/Let's Encrypt — TLS obsługuje Pangolin
- [ ] Sprawdzić w dashboardzie Pangolina, że Resource dla
      `bilety.myheadisdubby.com` wskazuje na port **8080** tego serwera
- [ ] (opcjonalnie) podmienić link w stopce / dodać link do Facebook eventu
