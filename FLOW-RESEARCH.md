# İzgeTour: "Uçak ve Tur" Arama Flow & UX Research Plan

## Uçuş Arama Modülü (Kayak / Skyscanner Emsali)
Arama formunda temel gereksinimler ve kullanıcıdan istenen etkileşimler:
1. **Temel Girdiler**
   - **Nereden / Nereye (From/To):** Zengin havaalanı veritabanı (IATA kodları, Şehir/Havaalanı seçimi, "Yakın havalimanlarını da ara" opsiyonu). Switch butonu (yönleri değiştirmek için).
   - **Tarih Seçici (Date Picker):** Tek Yön / Gidiş-Dönüş / Çoklu Şehir (Multi-city) toggle'ları. Gidiş ve dönüş tarihini aynı pop-up takvim üzerinde seçebilme. "Esnek tarihler" seçeneği (±3 gün matrisi için).
   - **Kapasite ve Sınıf (Pax & Class):** Yetişkin, Çocuk, Bebek (Koltuksuz/Koltuklu), yaş dağılımı. Sınıf seçimi (Ekonomi, Premium, Business, First).
2. **Ayar/Filtre Etkileşimi (Search Button'a tıklandıktan sonra)**
   - Yükleme ekranı: Animasyonlu spinner, "Havayolları taranıyor...", "En iyi fiyatlar bulunuyor" gibi aşamalı ilerleme. Skeleton loading ekranı tasarımı.
   - **Sonuç Listesi ve Sol Filtreler:** (Aktarma sayısı, Fiyat aralığı, Süre, Havayolu şirketi, Bagaj hakkı (kabin, bagajlı)). Kaydırma (slider) ve checkboxlar ile interaktif daraltmalar.
   - **Sıralama (Tabs):** En Ucuz, En Hızlı, En İyi Eşleşme (Kayak'ın özel Skoru - ücret ve süre matrisi).
3. **Detay Görünümü ve Satın Almaya Giden Checkout (Follow)**
   - Satın Al butonuna tıklandığında "Koltuk/Bagaj Opsiyonları (Upsell)" overlay (Basic, Standard, Flex paket seçenekleri - Ryanair/Pegasus stili).
   - Yolcu bilgileri ve Kimlik aşamasına pürüzsüz geçiş. Güven rozetleri.

## Tur & Seyahat Paketi Arama Modülü
Turlar çok daha "ilham odaklı" (Discover) olduğu için formlar esnek olmalıdır.
1. **Temel Girdiler**
   - **Destination / Theme:** İster spesifik "Kapadokya" ister konsept "Kültür Turları", "Gemi Turları", "Yurtdışı Yılbaşı".
   - **Ne Zaman:** Belli bir tarih yerine ay bazlı esneklik ("2026 Mayıs", "Kurban Bayramı").
   - **Uzunluk:** "Hafta sonu", "7+ gün".
2. **Sonuç Listesi ve Satış Teknikleri**
   - **Kart Kullanımı:** Her turun görseli (büyük), gün/gece sayısı, puan/reviews, kalkışlı otobüs/uçak seçeneklerinin belirteci.
   - "Az Kaldı", "%15 Erken Rezervasyon İndirimi", "Son 2 Koltuk" aciliyet FOMO etiketleri.
3. **Tur Detay Sayfası Akışı (Follow)**
   - **1. Section (Hero & Hooks):** Hero resim galerisi, kısa pitch, Tur fiyatından nelerin dahil/hariç olduğu. Olası tarihler ve rezervasyon butonu formunun her an ekranda sabit (sticky bar) tutulması.
   - **2. Section (Itinerary):** Gün Gün program. Harita entegrasyonu (başlangıç - duraklar - bitiş).
   - **3. Section (Accommodation):** Konaklanacak otellerin resimleri.
4. **Checkout (Satın Alma)**
   - İade / İptal Sigortası ekleme (Upsell). Oda Tipi (Single, Double bed difference veya 3. kişi ek yatak gibi) belirleme. Rehberlik paketleri seçimi. Ödeme sonrası bilgilendirme faturası. 

## İzgetour Sonraki Iterasyon (Roadmap)
- NotebookLM'den okunduğunda agent'ın yapması gereken: Componentleri planlarken Checkout için her zaman "Paket Yükseltme" sayfasını (Upsell modal'ını) modülarize etmek. Havaalanı Arama Input'una debounce destekli bir Search API koymak. DatePicker için "react-datepicker" ve Tailwind'in Calendar bileşenlerini customize etmek.
