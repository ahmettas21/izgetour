# İzgeTour Geliştirme Planı

## Mimari
- Next.js 16, App Router, i18n TR/EN (next-intl)
- Docker container (izgetour:latest, port 3000)
- Cloudflare Tunnel → izgetour.havaalanitransfer.gen.tr
- Mock data (src/data/) — gerçek API yok

## Aktif Session
OpenCode tmux: `izge-oc` (yuxor/claude-sonnet-4-6)
Session: ses_1dbce246dffegTvPR6olX0vEgR (Build agent)

## Kodlama Sırası
1. Design System — CSS variables, Tailwind config, renk paleti, font
2. FlightSearch komple yeniden yazma — yolcu seçimi, cabin class, trip type
3. SmartSearch güncelleme — flight tab
4. Filtre sayfaları — tours, hotels, flights (mock data)
5. Bug fix'ler — INSUFFICIENT_PATH, $$typeof, SW cache
6. Dark mode entegrasyonu

## Mevcut Hatalar
- INSUFFICIENT_PATH (browser console) → next-intl locale çözümlemesi
- $$typeof digest 406916464 → SupportBubble/ChatWindow null render
- SW.js "addAll failed" → service worker cache hatası

## Deploy
Build: npm run build → sudo docker build → sudo docker run
```
NODE_OPTIONS="--max-old-space-size=4096" npx next build
sudo docker build -t izgetour:latest .
sudo docker stop izgetour && sudo docker rm izgetour
sudo docker run -d --name izgetour --restart unless-stopped -p 3000:3000 izgetour:latest
```

## Kurallar
- git push YOK
- Secret/credential ASLA
- Mock data kullan

## Run 2026-05-14 23:40 UTC
✅ TypeScript clean (0 errors)
✅ Build successful (68 pages)
✅ Docker container running (localhost:3000)
✅ All pages return 200 (tr: /, /tours, /hotels, /flights)
🔧 Fixes applied:
  - Breadcrumb import added to flights/[slug]/page.tsx
  - FlightResult type aligned (removed FlightOffer, seatsLeft → availableSeats)
  - CabinClass import fixed in searchFlights.ts
  - Duplicate properties removed (availableSeats x2)
  - rawOffer removed from FlightResult
  - flightNumber → airlineCode+slug construct
  - seatsLeft removed from flights.ts mock data
  - refundable restored after cleanup
  - FlightComparePanel simplified to FlightResult only
  - FlightCardClient rewritten with FlightResult type
