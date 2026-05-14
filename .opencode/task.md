# Görev: Multi-City Locale Fix + Dashboard Tab i18n

## Durum
- ✅ MoodDestinationPicker → HeroBanner wire OK
- ✅ Docker build + deploy OK (HTTPS 200)
- ✅ CollaborativeTripBoard → Dashboard zaten wire edilmiş
- ✅ Build 68/68, lint 0

## Yapılacaklar

### 1. Multi-City Page: Client-side locale detection fix
`src/app/[locale]/flights/multi-city/page.tsx` kullanıyor:
```ts
const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
const LOCALE = pathname.startsWith('/en') ? 'en' as const : 'tr' as const;
```
Bunun yerine **Next.js params locale** kullanılmalı. Sayfa `'use client'` — useParams() ile locale alınabilir:
```ts
import { useParams } from 'next/navigation';
const params = useParams();
const LOCALE = (params?.locale as string) === 'en' ? 'en' : 'tr';
```

### 2. Dashboard Layout: CollaborativeTripBoard locale passthrough
`src/app/[locale]/dashboard/layout.tsx` içinde `renderContent`:
```ts
case "board":
  return <CollaborativeTripBoard />;
```
Bunu şuna çevir:
```ts
case "board":
  return <CollaborativeTripBoard locale={locale as 'tr' | 'en'} />;
```

### 3. Multi-City: MultiCityRouter locale passthrough kontrol
Sayfada zaten `MultiCityRouter locale={LOCALE}` var — OK.
MultiCitySearchForm'a da locale geçiyor — OK.

### 4. Build Test
```bash
npm run build 2>&1 | tail -5
```

## Notlar
- Sadece kod, git push yok
- Secret yok
- Build hatası olursa düzelt
