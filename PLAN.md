# İzgetour Proje ve Geliştirme Planı (Kayak.com Referanslı)

## 🎯 Vizyon
İzgetour platformu, Kayak.com gibi global, uçtan uca modern bir "Seyahat Arama ve Karşılaştırma" deneyimi sunarken, aynı zamanda İzge Tour'un özel turlarını ve butik deneyimlerini öne çıkaran bir mimari üzerine inşa edilmiştir.

## 🧭 User Flow (Kullanıcı Akışı)
1. **Ana Sayfa (Landing)**
   - Devasa, ilham verici Hero Banner (Türkiye odaklı)
   - *Kayak-style Smart Search:* Tur, Uçak, Otel (yakında Araç) sekmeleri arası pürüzsüz geçiş.
   - Öne Çıkanlar ve "Neden İzgetour" özellikleri.
2. **Arama ve İndeksleme Sonuçları (Listing Platform)**
   - Smart Search'ten gelen parametrelere (Tarih, Kişi, Lokasyon) göre anlık (Server-Side) render edilmiş sonuçlar.
   - Sol menü: Detaylı filtreleme (fiyat, süre, puan, iptal politikası).
   - Card tasarımı: "En İyi Eşleşme", "Fiyat Performans" gibi tag'ler.
3. **Detay Sayfası (Detail & Itinerary)**
   - Görsel ağırlıklı (gallery) sunum.
   - Uçak: Sefer detayları, bagaj hakları.
   - Tur: Gün gün güzergah (Itinerary) haritalı, dahil/hariç hizmetler, rehber bilgisi.
   - Otel: Oda tipleri, olanaklar.
4. **Checkout & Rezervasyon**
   - Kayıt olmadan devam edebilme (Guest Checkout).
   - %100 güvenli (Shield) ödeme onaylama ekranı.
   - Dinamik özet alanı.
5. **Kullanıcı Paneli (Dashboard)**
   - Geçmiş ve gelecek seyahatler.
   - Fatura yönetimi, bilet indirme.
   - Favoriler.

## 📦 Modül Geliştirme Sırası & Roadmap

| Aşama | Modül | Durum |
| :--- | :--- | :--- |
| **Faz 1** | Homepage (Hero, SmartSearch, Features, Popular Tour Cards) | ✅ Tamamlandı |
| **Faz 1** | i18n & Navigation Routing Sistemi | ✅ Tamamlandı |
| **Faz 2** | Tours - Listeleme Sayfası & Filtreler | ✅ Tamamlandı |
| **Faz 2** | Tours - Detay Sayfası (slug) & Harita UI | ✅ Tamamlandı |
| **Faz 3** | Uçak Bileti Modülü (Uçuş Arama & Listeleme UI) | ⏳ Bekliyor |
| **Faz 4** | Otel Modülü (Entegrasyona Hazır Tasarım) | ⏳ Bekliyor |
| **Faz 5** | Auth (Login/Signup - Supabase via İzgetour ID) | ⏳ Bekliyor |
| **Faz 6** | Sepet, Checkout ve Başarılı Ödeme Ekranları | ⏳ Bekliyor |

## 🚀 Yeni Bulunan Modüller (Devamlı Eklenecek)
- **Vize Destek Modülü:** Check-list ekranı (Kayak modeline ek olarak)
- **Paket Seyahat Planlayıcı (AI Travel Planner):** Kullanıcı bütçe ve ilgi alanı girer, platform tüm uçak+otel+tur sepetini hazırlar.
- **Görsel Karşılaştırma Paneli (Kayak-style Split View):** Listeleme sayfasında 2-3 turu yan yana karşılaştırmalı görüntüleme (fiyat/süre/içerik tablosu)
- **Akıllı Filtre Önerileri:** Kullanıcı aramasına göre otomatik filtre önerme (örn: "deniz tatili" yazınca plaj turlarını otomatik seçme)
- **Harita Katmanı (Map View):** Tur listesinde harita üzerinde lokasyon bazlı görüntüleme (Kayak Otel haritası gibi)

*Not: Bu plan proje geliştikçe sürekli revize edilerek güncellenecektir (Her 10 dk'da cron tarafından denetlenir).*
