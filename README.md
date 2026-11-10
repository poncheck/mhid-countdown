# MHID Countdown — bilety.myheadisdubby.com

Prosta strona z odliczaniem do zamknięcia przedsprzedaży biletów online na
"20 Years of My Head Is Dubby" (21.11.2026, Protokultura, Wrocław).

## Co jest w środku

- `site/index.html` — strona (PL)
- `site/style.css` — styl dopasowany do plakatu (pomarańcz/granat/neonowa zieleń/kremowy)
- `site/script.js` — logika odliczania + 3 stany (przed startem / live 48h / zamknięte)
- `site/poster.jpg` — grafika z plakatu użyta jako hero image
- `Dockerfile` — buduje obraz nginx serwujący stronę statyczną
- `nginx.conf` — konfiguracja nginx (gzip, cache)
- `docker-compose.yml` — **wersja produkcyjna**: strona + Caddy (reverse proxy z automatycznym HTTPS)
- `docker-compose.local.yml` — **wersja do testów lokalnych**: tylko nginx, bez SSL, na porcie 8080
- `Caddyfile` — konfiguracja Caddy dla domeny bilety.myheadisdubby.com

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

## ⚠️ Uruchomienie LOKALNE (testy, podgląd) — BEZ SSL

Jeśli chcesz tylko zobaczyć, jak strona wygląda, **nie używaj** zwykłego
`docker compose up` — to odpala Caddy, który próbuje wygenerować certyfikat
SSL przez Let's Encrypt. Lokalnie (bez publicznego DNS i portu 443 widocznego
z internetu) to się nie uda i strona nie będzie dostępna, nawet przez HTTP.

**Do testów lokalnych użyj pliku `docker-compose.local.yml`:**

```bash
cd mhid-countdown
docker compose -f docker-compose.local.yml up -d --build
```

Strona będzie dostępna pod: **http://localhost:8080**

Zatrzymanie:
```bash
docker compose -f docker-compose.local.yml down
```

---

## 🚀 Uruchomienie PRODUKCYJNE (na realnym serwerze, z domeną)

### Wymagania przed startem
- Serwer z publicznym adresem IP i otwartymi portami **80** i **443** na zewnątrz
  (firewall/security group musi przepuszczać ruch z internetu na te porty)
- Rekord DNS **A** (lub AAAA) dla `bilety.myheadisdubby.com` wskazujący na
  publiczny adres IP tego serwera — **musi być aktywny PRZED startem**,
  bo Caddy sprawdza go przy generowaniu certyfikatu Let's Encrypt

### Start
```bash
cd mhid-countdown
docker compose up -d --build
```

Po chwili strona powinna być dostępna pod `https://bilety.myheadisdubby.com`.
Pierwsze uruchomienie może potrwać do minuty (Caddy generuje certyfikat).

### Sprawdzenie logów (np. jeśli certyfikat się nie generuje)
```bash
docker compose logs -f caddy
```

Typowe przyczyny, gdy certyfikat się nie generuje:
- DNS jeszcze nie wskazuje na ten serwer (sprawdź: `dig bilety.myheadisdubby.com`)
- Port 80 lub 443 zablokowany przez firewall/dostawcę hostingu
- Inna usługa już zajmuje port 80/443 na serwerze

### Zatrzymanie
```bash
docker compose down
```

## Do zrobienia przed publikacją

- [x] Link do zakupu biletów (Stage24) wpisany w `site/script.js`
- [ ] Ustawić DNS A/AAAA dla `bilety.myheadisdubby.com`
- [ ] Otworzyć porty 80/443 na serwerze (firewall)
- [ ] (opcjonalnie) podmienić link w stopce / dodać link do Facebook eventu
