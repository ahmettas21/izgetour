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
   - **Uçak:** Sefer detayları, bagaj hakları, uçak tipi, iade koşulları ✅
   - Tur: Gün gün güzergah (Itinerary) haritalı, dahil/hariç hizmetler, rehber bilgisi.
   - Otel: Oda tipleri, olanaklar.
   - **Fiyat Takibi:** Takip edilen uçuşları localStorage'da saklama + Bell/BellOff UI ✅
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
| **Faz 3** | Uçak Bileti Modülü (Uçuş Arama & Listeleme UI) | ✅ Tamamlandı |
| **Faz 3** | Uçak Bileti Detay Sayfası (Fiyat Takibi + Sidebar) | ✅ Tamamlandı |
| **Faz 3** | FlightFilters (Airline/Stops/Price/Time/Cancellation) | ✅ Tamamlandı |
| **Faz 3** | FlightSortSelect + FlightCard Component'leri | ✅ Tamamlandı |
| **Faz 4** | Otel Modülü (Entegrasyona Hazır Tasarım) | ✅ Tamamlandı |
| **Faz 5** | Auth (Login/Signup - Supabase via İzgetour ID) | ✅ Tamamlandı |
| **Faz 6** | Sepet, Checkout ve Başarılı Ödeme Ekranları | ✅ Tamamlandı |
| **Faz 7** | Checkout UX Geliştirmeleri (Apple/Google Pay, Kupon, Order Summary componentleri) | ✅ Tamamlandı |
| **Faz 8** | Gamification/Badge Sistemi (GamificationBadges.tsx) | ✅ Tamamlandı |
| **Faz 8** | Smart Itinerary - Hava Durumu + Etkinlik Entegrasyonlu Seyahat Planı (SmartItinerary.tsx) | ✅ Tamamlandı |
| **Faz 8** | Görsel Karşılaştırma Paneli - Kayak-style Split View (ComparePanel.tsx) | ✅ Tamamlandı |
| **Faz 9** | Saved Searches & Notification Hub (SavedSearches.tsx) | ✅ Tamamlandı |
| **Faz 9** | Mood-Based Destination Picker (MoodDestinationPicker.tsx) | ✅ Tamamlandı |
| **Faz 9** | Loyalty Tier System - Bronze/Silver/Gold/Platinum (LoyaltyTierSystem.tsx) | ✅ Tamamlandı |
| **Faz 10** | Collaborative Trip Board - Sürükle-bırak paylaşımlı planlama panosu (CollaborativeTripBoard.tsx) | ✅ Tamamlandı |
| **Faz 10** | AI Chatbot Concierge - LLM tabanlı seyahat asistanı (AIChatbotConcierge.tsx) | ✅ Tamamlandı |
| **Faz 10** | Flexible Date Calendar Heatmap - Kayak-style en ucuz gün takvimi (FlexibleDateCalendar.tsx) | ✅ Tamamlandı |

## 🚀 Yeni Bulunan Modüller (Devamlı Eklenecek)
- **Checkout UX Geliştirmeleri:** Tek tıkla ödeme, Apple Pay & Google Pay entegrasyonu, dinamik indirim kuponları ve sorunsuz misafir checkout deneyimi. (Component taslakları hazırlandı ✅)
- **Gelişmiş Sepet Özelliği:** Sepet içinde anlık fiyat güncelleme, çeşitli para birimi desteği ve otomatik vergi hesaplama. (Kur ve Vergi modülleri eklendi ✅)
- **Smart Itinerary (Akıllı Seyahat Planı):** Seçilen tatil tarihlerine hava durumu tahminleri (Weather API) ve yerel etkinlik/festival bildirimleri entegre ederek gösterim. (Component hazırlandı ✅)
- **Dinamik Fiyatlandırma Gösterimi:** Kullanıcılara belirli tarih aralıklarındaki fiyat dalgalanmalarını gösteren grafik (Kayak uçuş fiyat grafiği benzeri). (Component hazırlandı ✅)
- **Gamification/Badge Sistemi:** Kullanıcıların belirli turları (ör. İlk Asya Uçuşu, Tarih Meraklısı) tamamladıkça rozet kazandığı mini bir UX gamification özelliği. (Component hazırlandı ✅)
- **AI-powered Hotel Recommendation Engine:** Kişiye özel otel önerileri, kullanıcı tercihleri ve bütçeye göre dinamik öneri sistemi.
- **Vize Destek Modülü:** Check-list ekranı (Kayak modeline ek olarak)
- **Paket Seyahat Planlayıcı (AI Travel Planner):** Kullanıcı bütçe ve ilgi alanı girer, platform tüm uçak+otel+tur sepetini hazırlar. (Component hazırlandı ✅)
- **Görsel Karşılaştırma Paneli (Kayak-style Split View):** Listeleme sayfasında 2-3 turu yan yana karşılaştırmalı görüntüleme (fiyat/süre/içerik tablosu) (Component hazırlandı ✅)
- **Akıllı Filtre Önerileri:** Kullanıcı aramasına göre otomatik filtre önerme (örn: "denizvar" yazınca plaj turlarını otomatik seçme)
- **Harita Katmanı (Map View):** Tur listesinde harita üzerinde lokasyon bazlı görüntüleme (Kayak Otel haritası gibi)
- **Uçuş Fiyat Takibi (Price Alert):** Takip edilen uçuşlar localStorage'da saklanır. Gerçek bildirim için Supabase + e-posta entegrasyonu.
- **Uçuş Karşılaştırma (Split View):** 2-3 uçuşu yan yana karşılaştırmalı görüntüleme
- **Hızlı Rota Seçimi:** Popüler rotalara tek tıkla arama, emoji ile görselleştirme
- **Kabin Sınıfı Filtresi:** Economy/Business/Premium seçimi
- **Passwordless Magic Link Auth:** Kullanıcı e-posta ile tek tıkta oturum açabilir, OTP yerine güvenli link gönderilir
- **Sosyal Seyahat Grupları (Yeni UX):** Kullanıcıların sepetini veya planladıkları seyahatleri ortak bir link üzerinden arkadaşlarıyla grupça oylayabileceği bir mini "Party Plan" modülü. (Component hazırlandı ✅)
- **Trip Countdown Widget:** Rezervasyon sonrası ana sayfada anlık olarak "Seyahate 14 Gün Kaldı" şeklinde gösteren kişisel animasyonlu sayaç. (Component hazırlandı ✅)
- **Social Proof Toasts:** "Şu an 5 kişi bu tura bakıyor", "Son 2 koltuk" gibi canlı motivasyon bildirimleri. (Component hazırlandı ✅)
- **Multi-City Complex Router:** A'dan B'ye uç, arayı trenle/turla geç, C'den dön mantığında gelişmiş Kayak tarzı çoklu rota oluşturucu. (Component hazırlandı ✅)
- **Sustainability Score:** Yeşil Seyahat Skoru ve karbon ayak izi hesaplama/dengeleme modülü. (Component hazırlandı ✅)
- **Voice Guided Interactive Map:** Haritada sesli rehber ile turları/lokasyonları interaktif gezme UX'i. (Component hazırlandı ✅)

*Not: Bu plan proje geliştikçe sürekli revize edilerek güncellenecektir (Her 10 dk'da cron tarafından denetlenir).*
- **Collaborative Trip Board (Yeni Trend — 2026):** Arkadaşlarla gerçek zamanlı paylaşımlı planlama panosu. Kayak, Wanderlog ve Notion benzeri sürükle-bırak itinerary özelliği. (Component hazırlandı ✅)
- **AI Chatbot Concierge (Yeni Trend):** LLM tabanlı doğal dil seyahat asistanı — "Ailemle hafta sonu Ege'de ne yapabiliriz?" tarzı sorulara cevap + otomatik arama. (Component hazırlandı ✅)
- **Flexible Date Calendar Heatmap:** Kayak'ın esnek tarih özelliği gibi, ay boyunca en ucuz günleri renk haritasıyla gösteren takvim view'i. (Component hazırlandı ✅)
- **Predictive Trip Bundler (2026 Trendi):** Kullanıcı bir uçuş seçtiğinde, AI otomatik olarak ilişkili otel+transfer+tur önerileri oluşturur ve "Paket İndirim" ile sunar. Google Trips benzeri ama auto-bundle mantığıyla.
- **Micro-Adventure Generator (2026 Trendi):** 1-2 günlük, yakın mesafe, düşük bütçeli "kaçamak" önerileri. Gen-Z ve remote worker segmentine yönelik, lokasyon bazlı hızlı arama.
- **Accessibility Score & Filters (2026 Trendi):** Engelli-dostu otel/tur/uçuş filtresi. Tekerlekli sandalye uyumluluğu, duyusal hassasiyet derecesi, yardımcı hayvan politikası gibi detaylı erişilebilirlik skoru.
- **Luggage AR Sizer:** Telefon kamerasıyla valizin boyutunu ölçüp Uçak bagaj kurallarına (Cabin/Checked) uyup uymadığını anlık doğrulayan AR modülü. (Component hazırlandı ✅)
- **Dynamic Local Cuisine Recommender:** Seçilen uçuş/otel varış noktasına göre restoran ve lokal lezzet önerilerini Itinerary listesine serpiştiren akıllı öneri. (Component hazırlandı ✅)
- **Saved Searches & Notification Hub:** Kullanıcının son aramalarını kayıt altına alıp, fiyat düştüğünde Dashboard üzerinden bildirim gönderecek merkezi bildirim paneli. (Component hazırlandı ✅)
- **Mood-Based Destination Picker:** "Macera", "Romantik", "Huzur", "Kültür" gibi mod seçimi ile kullanıcıya özelleştirilmiş destinasyon önerisi sunan interaktif picker widget'i. (Component hazırlandı ✅)
- **Loyalty Tier System (Bronze/Silver/Gold/Platinum):** Gamification badge'leriyle entegre, toplam harcama ve seyahat sayısına göre özel ürgü tier sistemi. Üst tier'lerde öncelikli servis, indirim, lounge erişimi gibi avantajlar. (Component hazırlandı ✅)
