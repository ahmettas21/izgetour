# Next OpenCode Task

## Hedef: MoodDestinationPicker → Homepage Hero Wire + Admin Commit

### AC'ler
- AC1: **MoodDestinationPicker** component'ini homepage hero section'a wire et (src/app/[locale]/page.tsx)
  - dynamic(() => import(...), { ssr: false }) ile import
  - SocialProofToastWrapper öncesine yeni section olarak ekle
  - Section başlığı: {locale === 'tr' ? 'Ruh Haline Göre Rota Seç' : 'Pick a Destination by Mood'}
  - Alt metin: {locale === 'tr' ? 'Nasıl hissetmek istersin?' : 'How do you want to feel?'}
- AC2: MoodDestinationPicker zaten locale prop destekliyor — yeni prop ekleme
- AC3: Admin pages untracked (git) — commit sonrası push yapılmayacak
- AC4: `npm run lint` → 0 errors, 0 warnings
- AC5: `npm run build` → başarılı

### Files
- src/app/[locale]/page.tsx (dynamic import + section)
- src/messages/tr.json (opsiyonel: section title/desc key'leri)
- src/messages/en.json (opsiyonel: section title/desc key'leri)

### Risk
- MoodDestinationPicker zaten 'use client' ve locale prop alıyor — daha önce DynamicCuisineRecommender ile test edildi
- SSG sayfasına client component eklemek performance hit yaratmaz (dynamic ssr:false)
