# İzgeTour Geliştirme Planı

## Mimari
- Next.js 16, App Router, i18n TR/EN (next-intl)
- Docker container (izgetour:latest, port 3000)
- Cloudflare Tunnel → izgetour.havaalanitransfer.gen.tr
- Mock data (src/data/) — gerçek API yok

## Aktif Session
OpenCode tmux: `izge-oc` (yuxor/claude-sonnet-4-6)
Session: ses_1d6e69841ffeREwp94n7XyKpz0 (Build agent)

## Build Status
✅ TypeScript (tsc --noEmit): temiz
✅ Next.js build: başarılı (27 route)
✅ Docker: izgetour:latest çalışıyor (port 3000)

## Yapılan İşler (✅)

### Kritik Düzeltmeler (1-4)
- ✅ `--brand`, `--brand-dark`, `--brand-light` globals.css:root'da tanımlı
- ✅ Hero-SmartSearch-Features-MoodDestinationPicker sırası düzeltildi
- ✅ SupportBubble/ChatWindow: loading spinner eklendi, null render fix
- ✅ Footer linkleri locale-aware (next-intl Link ile)

### Tasarım İyileştirmeleri (5-7)
- ✅ Section spacing: `py-14 sm:py-20 lg:py-24` standardize
- ✅ Features grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- ✅ EN çevirileri düzeltildi (cabin_economy, cabin_business vb.)

### Yeni Özellikler (8-11)
- ✅ Wishlist sayfası: `/tr/wishlist`
- ✅ Breadcrumb: tours/hotels/flights detay sayfalarında
- ✅ Recently Viewed: Footer'da gösteriliyor (localStorage, 5 ürün)
- ✅ Privacy & Terms sayfaları oluşturuldu
- ✅ error.tsx özelleştirildi (brand renkleri, gradient bg)
- ✅ not-found.tsx oluşturuldu (404)

## Hala Yapılacaklar
- ⬜ Dark mode tutarlılık: HeroBanner, MoodDestinationPickerClient, TourCard, HotelCard, FlightCard - `dark:` class'ları
- ⬜ Social media linkleri: placeholder (#) varsa İzgetour profillerine yönlendir
- ⬜ FlightCard/Breadcrumb entegrasyon kontrolü

## Mevcut Hatalar (Takip)
- INSUFFICIENT_PATH (browser console) → next-intl locale çözümlemesi (orta öncelik)
- SW.js "addAll failed" → service worker cache hatası (düşük öncelik)

## Deploy
```
NODE_OPTIONS="--max-old-space-size=4096" npx next build
sudo docker build -t izgetour:latest .
sudo docker stop izgetour && sudo docker rm izgetour
sudo docker run -d --name izgetour --restart unless-stopped -p 3000:3000 izgetour:latest
```
