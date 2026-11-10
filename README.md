# MHID Countdown — bilety.myheadisdubby.com

Prosta strona z odliczaniem do zamknięcia przedsprzedaży biletów online na
"20 Years of My Head Is Dubby" (21.11.2026, Protokultura, Wrocław).

## Co jest w środku

- `site/index.html` — strona (PL)
- `site/style.css` — styl dopasowany do plakatu (pomarańcz/granat/neonowa zieleń/kremowy)
- `site/script.js` — logika odliczania + przełączenie na "zamknięte" po deadline
- `site/poster.jpg` — grafika z plakatu użyta jako hero image
- `Dockerfile` — buduje obraz nginx serwujący stronę statyczną
- `nginx.conf` — konfiguracja nginx (gzip, cache)
- `docker-compose.yml` — uruchamia stronę + Caddy (reverse proxy z automatycznym HTTPS)
- `Caddyfile` — konfiguracja Caddy dla domeny bilety.myheadisdubby.com

## Jak to działa

1. Strona liczy czas do **poniedziałku 16.11.2026, 8:00 (czas polski, CET)**.
2. Po upłynięciu deadline'u, licznik znika i pokazuje się komunikat
   "Przedsprzedaż online zakończona — bilety na bramce w dniu imprezy".
3. Przycisk "KUP BILET TERAZ" prowadzi pod link zdefiniowany w `site/script.js`
   w zmiennej `BUY_URL` — **trzeba go podmienić na faktyczny link do sprzedaży
   biletów (Stage24)**.

## Uruchomienie (Docker Compose)

### Wymagania przed startem
- Serwer z otwartymi portami **80** i **443** na zewnątrz
- Rekord DNS **A** (lub AAAA) dla `bilety.myheadisdubby.com` wskazujący na
  publiczny adres IP tego serwera — Caddy sam wygeneruje certyfikat Let's Encrypt
  przy pierwszym uruchomieniu, ale DNS musi być już aktywny

### Start
```bash
cd mhid-countdown
# 1. Podmień link do zakupu biletów w site/script.js (zmienna BUY_URL)
# 2. Odpal:
docker compose up -d --build
```

Po chwili strona powinna być dostępna pod `https://bilety.myheadisdubby.com`.

### Sprawdzenie logów (np. jeśli certyfikat się nie generuje)
```bash
docker compose logs -f caddy
```

### Zatrzymanie
```bash
docker compose down
```

## Do zrobienia przed publikacją

- [ ] Podmienić `BUY_URL` w `site/script.js` na realny link do sprzedaży biletów
- [ ] Ustawić DNS A/AAAA dla `bilety.myheadisdubby.com`
- [ ] Otworzyć porty 80/443 na serwerze (firewall)
- [ ] (opcjonalnie) podmienić link w stopce / dodać link do Facebook eventu
