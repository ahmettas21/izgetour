export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  coverImage: string;
  category: string;
  categoryEn: string;
  readTime: number; // minutes
  date: string; // ISO date
  author: string;
  tags: string[];
  tagsEn: string[];
  relatedSlugs?: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'kapadokya-sirt-cantasi-rehberi',
    slug: 'kapadokya-sirt-cantasi-rehberi',
    title: 'Kapadokya’ya Sırt Çantasıyla Seyahat: 2025 Güncel Rehber',
    titleEn: 'Backpacking Cappadocia: 2025 Updated Guide',
    summary:
      'Kapadokya’yı sırt çantasıyla keşfetmek isteyenler için bütçe dostu konaklama, ulaşım ve gezi ipuçları.',
    summaryEn:
      'Budget-friendly accommodation, transportation, and travel tips for backpackers exploring Cappadocia.',
    content: `Kapadokya, benzersiz peri bacaları, yer altı şehirleri ve sıcak hava balonlarıyla Türkiye'nin en popüler turistik bölgelerinden biri.

## Neden Sırt Çantasıyla Kapadokya?

Kapadokya, sırt çantalı gezginler için mükemmel bir destinasyon. Uygun konaklama seçenekleri, toplu taşıma ağları ve yürüyerek keşfedilebilecek birçok doğal güzellik sunuyor.

## Ulaşım

**Otobüs ile:** İstanbul, Ankara, İzmir gibi büyük şehirlerden Göreme'ye gece otobüsleri var. Bilet fiyatları 300-500 TL arasında değişiyor.

**Uçak ile:** Nevşehir Kapadokya Havalimanı'na (NAV) iç hat uçuşları mevcut. Havalimanından Göreme merkeze HAVAŞ otobüsleriyle ulaşabilirsiniz.

## Konaklama

Göreme'deki pansiyonlar ve hosteller sırt çantalı gezginler için ideal. Ortalama bir yataklı odada gecelik 400-700 TL arası fiyatlar bulabilirsiniz.

## Gezilecek Yerler

1. **Açık Hava Müzesi** - Göreme'nin en ünlü noktası, giriş ücreti 400 TL
2. **Uçhisar Kalesi** - Kapadokya manzarasının en güzel izlendiği nokta
3. **Derinkuyu Yeraltı Şehri** - Yerin 85 metre altında bir şehir
4. **Kızılçukur Vadisi** - Gün batımını izlemek için en iyi yer
5. **Ihlara Vadisi** - 14 km'lik muhteşem bir yürüyüş rotası

## Bütçe İpuçları

- Sabah erken saatlerde balon izlemek ücretsiz!
- Yerel restoranlarda yemek yiyerek tasarruf edin
- Müze Kart alarak müzelerde %50'ye varan indirim kazanın
- Şehirler arası otobüsleri tercih ederek ulaşım masraflarınızı azaltın`,
    contentEn: `Cappadocia is one of Turkey's most popular tourist regions with its unique fairy chimneys, underground cities, and hot air balloons.

## Why Backpack Cappadocia?

Cappadocia is a perfect destination for backpackers. It offers affordable accommodation, public transportation networks, and many natural beauties to explore on foot.

## Transportation

**By Bus:** Overnight buses from Istanbul, Ankara, Izmir to Göreme. Tickets range from 300-500 TL.

**By Plane:** Domestic flights to Nevşehir Cappadocia Airport (NAV). HAVAŞ shuttles connect the airport to Göreme center.

## Accommodation

Pensions and hostels in Göreme are ideal for backpackers. An average dorm bed costs 400-700 TL per night.

## Attractions

1. **Open Air Museum** - Göreme's most famous spot, entrance 400 TL
2. **Uçhisar Castle** - Best panoramic view of Cappadocia
3. **Derinkuyu Underground City** - A city 85 meters underground
4. **Kızılçukur Valley** - Best sunset spot
5. **Ihlara Valley** - A magnificent 14 km hiking trail

## Budget Tips

- Watching balloons at sunrise is free!
- Save money by eating at local restaurants
- Get a Museum Card for up to 50% discount at museums
- Reduce transport costs by choosing intercity buses`,
    coverImage:
      'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1200&q=80',
    category: 'Seyahat Rehberi',
    categoryEn: 'Travel Guide',
    readTime: 8,
    date: '2025-05-10',
    author: 'İzgeTour Ekibi',
    tags: ['Kapadokya', 'sırt çantası', 'bütçe seyahat', 'Türkiye'],
    tagsEn: ['Cappadocia', 'backpacking', 'budget travel', 'Turkey'],
    relatedSlugs: ['istanbul-3-gun-rota', 'antalya-plaj-rehberi'],
  },
  {
    id: 'istanbul-3-gun-rota',
    slug: 'istanbul-3-gun-rota',
    title: 'İstanbul’da 3 Günde Gezilecek Yerler: Mükemmel Rota Planı',
    titleEn: '3 Days in Istanbul: The Perfect Itinerary',
    summary:
      'Tarihi yarımadadan Boğaz’a, İstanbul’u 3 günde en iyi şekilde keşfetmek için adım adım rota.',
    summaryEn:
      'Step-by-step itinerary to explore Istanbul in 3 days, from the historic peninsula to the Bosphorus.',
    content: `İstanbul, iki kıtayı birleştiren büyüleyici şehir. Tarih, kültür ve lezzetin iç içe geçtiği bu metropolde 3 günlük mükemmel rotanızı hazırladık.

## 1. Gün: Tarihi Yarımada

**Sabah:**
- Ayasofya-i Kebir Camii (eski Ayasofya)
- Sultanahmet Camii (Mavi Camii)
- Sultanahmet Meydanı

**Öğle:**
- Kapalıçarşı'da kısa bir tur
- Eminönü'nde balık ekmek molası

**Öğleden Sonra:**
- Topkapı Sarayı
- Yerebatan Sarnıcı

## 2. Gün: Sanat ve Boğaz

**Sabah:**
- İstanbul Modern Sanat Müzesi
- Galata Kulesi

**Öğle:**
- İstiklal Caddesi'nde yürüyüş
- Tarihi çikolatacılarda mola

**Öğleden Sonra:**
- Boğaz turu (Eminönü'nden kalkan tekneler)
- Kuzguncuk veya Çengelköy'de çay molası

## 3. Gün: Keşfedilmemiş Köşeler

**Sabah:**
- Balat renkli evleri
- Fener Rum Patrikhanesi

**Öğle:**
- Pierre Loti Tepesi (teleferikle)
- Eyüp Sultan Camii

**Öğleden Sonra:**
- Kadıköy'de sokak lezzetleri
- Moda sahilinde yürüyüş

## İpuçları

- İstanbul Kart alarak toplu taşımada tasarruf edin
- Hafta içi ziyaret ederek kalabalıktan kaçının
- Erken saatlerde Ayasofya ve Topkapı'yı gezmek için sıra beklemezsiniz`,
    contentEn: `Istanbul, the mesmerizing city that bridges two continents. We've prepared the perfect 3-day itinerary for this metropolis where history, culture, and flavor intertwine.

## Day 1: Historic Peninsula

**Morning:**
- Hagia Sophia Grand Mosque
- Sultanahmet Mosque (Blue Mosque)
- Sultanahmet Square

**Lunch:**
- Quick tour of the Grand Bazaar
- Fish sandwich break at Eminönü

**Afternoon:**
- Topkapı Palace
- Basilica Cistern

## Day 2: Art and Bosphorus

**Morning:**
- Istanbul Museum of Modern Art
- Galata Tower

**Lunch:**
- Walk along İstiklal Street
- Break at historic chocolatiers

**Afternoon:**
- Bosphorus tour (boats from Eminönü)
- Tea break in Kuzguncuk or Çengelköy

## Day 3: Hidden Gems

**Morning:**
- Balat colorful houses
- Fener Greek Orthodox Patriarchate

**Lunch:**
- Pierre Loti Hill (via cable car)
- Eyüp Sultan Mosque

**Afternoon:**
- Street food in Kadıköy
- Walk along Moda coast

## Tips

- Get an Istanbulkart for public transport savings
- Visit on weekdays to avoid crowds
- Go early to skip queues at Hagia Sophia and Topkapı`,
    coverImage:
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
    category: 'Şehir Rehberi',
    categoryEn: 'City Guide',
    readTime: 10,
    date: '2025-04-28',
    author: 'İzgeTour Ekibi',
    tags: ['İstanbul', 'şehir rehberi', 'gezi rotası', 'tarih'],
    tagsEn: ['Istanbul', 'city guide', 'itinerary', 'history'],
    relatedSlugs: ['vize-basvuru-rehberi', 'turkiye-ucuz-tatil'],
  },
  {
    id: 'vize-basvuru-rehberi',
    slug: 'vize-basvuru-rehberi',
    title: '2025 Vize Başvuru Rehberi: Schengen Vizesi Almak Artık Daha Kolay',
    titleEn: '2025 Visa Guide: Getting a Schengen Visa is Now Easier',
    summary:
      'Schengen vizesi başvurusu için güncel prosedürler, gerekli belgeler ve püf noktaları.',
    summaryEn:
      'Current Schengen visa application procedures, required documents, and expert tips.',
    content: `Avrupa seyahati planlıyorsanız Schengen vizesi süreci hakkında bilmeniz gereken her şeyi bu rehberde bulabilirsiniz.

## Schengen Vizesi Nedir?

27 Avrupa ülkesinde geçerli olan kısa süreli seyahat izni. 90 gün içinde en fazla 90 gün kalmanıza izin verir.

## Gerekli Belgeler

1. **Pasaport** - Son 10 yıl içinde alınmış, en az 3 ay geçerlilik süresi olan
2. **Biyometrik Fotoğraf** - 35x45 mm, beyaz fonlu
3. **Başvuru Formu** - Online doldurulur
4. **Uçak ve Otel Rezervasyonları** - İptal edilebilir olanlar kabul edilir
5. **Seyahat Sağlık Sigortası** - En az 30.000 EUR teminatlı
6. **Banka Hesap Dökümü** - Son 3 ay
7. **Nüfus Cüzdanı Fotokopisi**
8. **İmza Sirküleri** veya **Çalışma Belgesi**

## Güncel Vize Ücretleri (2025)

- **Yetişkin:** 90 EUR
- **Çocuk (6-12 yaş):** 45 EUR
- **6 yaş altı:** Ücretsiz

## Başvuru Süreci

1. **Online form doldurma** - SchengenVisaInfo üzerinden
2. **Randevu alma** - Konsolosluk veya yetkili ofis
3. **Belgeleri teslim** - Pasaportla birlikte
4. **Parmak izi verme** - 59 ayda bir (12 yaş altı muaf)
5. **Bekleme süresi** - 15 takvim günü (standart)

## Püf Noktaları

- Randevu almak için en az 2 ay önceden plan yapın
- Belgelerin eksiksiz olduğundan emin olun — en sık ret nedeni eksik evrak
- Seyahat sağlık sigortanızı vize onayından sonra iptal etmeyin
- İlk başvuruda 1-2 günlük gezi planı yerine en az 5 günlük bir program gösterin`,
    contentEn: `If you're planning a trip to Europe, here's everything you need to know about the Schengen visa process.

## What is a Schengen Visa?

A short-stay travel permit valid in 27 European countries. Allows stays up to 90 days within any 180-day period.

## Required Documents

1. **Passport** - Issued within last 10 years, valid at least 3 months beyond return
2. **Biometric Photo** - 35x45mm, white background
3. **Application Form** - Completed online
4. **Flight and Hotel Reservations** - Cancellable ones are accepted
5. **Travel Health Insurance** - Minimum 30,000 EUR coverage
6. **Bank Statements** - Last 3 months
7. **ID Card Copy**
8. **Employment Letter** or **Company Registration**

## Current Visa Fees (2025)

- **Adult:** 90 EUR
- **Child (6-12):** 45 EUR
- **Under 6:** Free

## Application Process

1. **Fill online form** - Via SchengenVisaInfo
2. **Book appointment** - At consulate or authorized office
3. **Submit documents** - Along with passport
4. **Provide fingerprints** - Every 59 months (under 12 exempt)
5. **Waiting period** - 15 calendar days (standard)

## Pro Tips

- Plan at least 2 months ahead for appointments
- Ensure complete documents — incomplete files are the #1 rejection reason
- Don't cancel travel insurance after visa approval
- For first-time applicants, show at least 5 days itinerary rather than 1-2 days`,
    coverImage:
      'https://images.unsplash.com/photo-1593352216840-1aee13f45818?w=1200&q=80',
    category: 'Vize Rehberi',
    categoryEn: 'Visa Guide',
    readTime: 7,
    date: '2025-04-20',
    author: 'İzgeTour Ekibi',
    tags: ['vize', 'Schengen', 'seyahat', 'rehber'],
    tagsEn: ['visa', 'Schengen', 'travel', 'guide'],
    relatedSlugs: ['turkiye-ucuz-tatil', 'istanbul-3-gun-rota'],
  },
  {
    id: 'antalya-plaj-rehberi',
    slug: 'antalya-plaj-rehberi',
    title: 'Antalya’nın En Güzel Plajları: Mavi Bayraklı Koylar ve Gizli Cennetler',
    titleEn: "Antalya's Best Beaches: Blue Flag Coves and Hidden Paradises",
    summary:
      'Antalya ve çevresindeki en güzel plajlar, mavi bayraklı koylar ve keşfedilmemiş kumsallar.',
    summaryEn:
      'The most beautiful beaches in and around Antalya, blue flag coves, and undiscovered shores.',
    content: `Antalya, Türkiye'nin turizm başkenti. 650 km'den uzun sahiliyle her zevke hitap eden plajlar sunuyor.

## 1. Konyaaltı Plajı

Antalya merkezde, şehir hayatına yakın. Plaj boyunca kafeler, restoranlar ve bisiklet yolu var.

**Özellikler:** Mavi Bayrak, ücretsiz, duş ve soyunma kabinleri, engelli erişimi
**Ulaşım:** Şehir merkezinden tramvay ve otobüsle

## 2. Lara Plajı

Lüks otellerin önündeki altın renkli kumsal. İncecik kumu ve berrak deniziyle ünlü.

**Özellikler:** Mavi Bayrak, şemsiye ve şezlong kiralama, su sporları
**Ulaşım:** Antalya merkeze 12 km uzaklıkta

## 3. Kaputaş Plajı

Kaş ile Kalkan arasında, muhteşem turkuaz renkli koy. 187 basamakla inilen bu plaj, fotoğrafçıların favorisi.

**Özellikler:** Doğal plaj, canlı müzik yok, sakin atmosfer
**Ulaşım:** Kaş'a 20 km, Kalkan'a 7 km

## 4. Olimpos Plajı

Tarihi Likya kenti kalıntıları arasında, ağaç evlerle ünlü. Doğayla iç içe bir deneyim.

**Özellikler:** Caretta caretta yuvalama alanı, kamp alanı
**Ulaşım:** Antalya'ya 80 km uzaklıkta

## 5. Çıralı Plajı

Olimpos'a komşu, daha sakin bir alternatif. Uzun kumsalı ve doğal güzelliğiyle ideal.

## İpuçları

- Haziran-Eylül arası en ideal dönem
- Sabah erken veya akşamüstü saatlerini tercih edin
- Güneş kremi ve bol su ihmal etmeyin
- Kaputaş için spor ayakkabı giyin (merdivenler yorucu olabilir)`,
    contentEn: `Antalya is Turkey's tourism capital. With over 650 km of coastline, it offers beaches for every taste.

## 1. Konyaaltı Beach

Close to the city center. Cafes, restaurants, and bike path along the beach.

**Features:** Blue Flag, free entry, showers, accessible
**Transport:** Tram and bus from city center

## 2. Lara Beach

Golden sand beach in front of luxury hotels. Famous for fine sand and clear water.

**Features:** Blue Flag, umbrella/sunbed rental, water sports
**Transport:** 12 km from Antalya center

## 3. Kaputaş Beach

Between Kaş and Kalkan, stunning turquoise cove. 187 steps down, favorite of photographers.

**Features:** Natural beach, no loud music, peaceful atmosphere
**Transport:** 20 km from Kaş, 7 km from Kalkan

## 4. Olimpos Beach

Among ancient Lycian ruins, famous for tree houses. A nature-immersed experience.

**Features:** Caretta caretta nesting area, camping
**Transport:** 80 km from Antalya

## 5. Çıralı Beach

Neighbor to Olimpos, a quieter alternative. Ideal with its long sandy beach and natural beauty.

## Tips

- June-September is the ideal period
- Go early morning or late afternoon
- Don't forget sunscreen and plenty of water
- Wear sports shoes for Kaputaş (stairs can be tiring)`,
    coverImage:
      'https://images.unsplash.com/photo-1596178060671-7a80dc8055e6?w=1200&q=80',
    category: 'Plaj Rehberi',
    categoryEn: 'Beach Guide',
    readTime: 6,
    date: '2025-04-15',
    author: 'İzgeTour Ekibi',
    tags: ['Antalya', 'plaj', 'deniz', 'mavi bayrak'],
    tagsEn: ['Antalya', 'beach', 'sea', 'blue flag'],
    relatedSlugs: ['kapadokya-sirt-cantasi-rehberi', 'turkiye-ucuz-tatil'],
  },
  {
    id: 'turkiye-ucuz-tatil',
    slug: 'turkiye-ucuz-tatil',
    title: 'Türkiye’de Ucuz Tatil: Cebinizi Yakmayacak 5 Destinasyon',
    titleEn: 'Budget Holiday in Turkey: 5 Destinations That Won\'t Break the Bank',
    summary:
      'Bütçe dostu tatil için Türkiye\'nin en ekonomik rotaları, konaklama ve yeme-içme ipuçları.',
    summaryEn:
      'Turkey\'s most budget-friendly destinations with accommodation and dining tips.',
    content: `Tatil yapmak pahalı olmak zorunda değil. Türkiye, her bütçeye uygun seçenekler sunan bir cennet.

## 1. Karadeniz Yaylaları

**Neden Ucuz?** Konaklama yerel pansiyonlarda 500 TL'den başlıyor. Yemekler doğal ve ucuz.

**Öneriler:**
- Ayder Yaylası
- Uzungöl
- Pokut Yaylası

**Ortalama Günlük Bütçe:** 800-1200 TL

## 2. Mardin

**Neden Ucuz?** Güneydoğu'nun en otantik şehri. Konaklama ve yemek fiyatları turistik bölgelere göre %40 daha ucuz.

**Öneriler:**
- Mardin taş evleri
- Midyat
- Deyrulzafaran Manastırı

**Ortalama Günlük Bütçe:** 700-1000 TL

## 3. Safranbolu

**Neden Ucuz?** UNESCO mirası olmasına rağmen fiyatlar makul. Tarihi konaklarda konaklama deneyimi.

**Öneriler:**
- Tarihi çarşı
- Hıdırlık Tepesi
- Eski çarşıda lokum alışverişi

**Ortalama Günlük Bütçe:** 600-1000 TL

## 4. Şirince (Selçuk)

**Neden Ucuz?** Efes'e yakın ama fiyatlar çok daha makul. Şarap tadımı ve köy kahvaltısı.

**Öneriler:**
- Şirince evleri
- Efes Antik Kenti (yakın)
- Sirince şarapları

**Ortalama Günlük Bütçe:** 700-1100 TL

## 5. Datça

**Neden Ucuz?** Bodrum'un kalabalık ve pahalı versiyonu yerine Datça'yı tercih edin.

**Öneriler:**
- Knidos Antik Kenti
- Palamutbükü Plajı
- Datça merkez

**Ortalama Günlük Bütçe:** 900-1300 TL

## Genel Tasarruf İpuçları

- Sezon dışı seyahat edin (Eylül-Kasım veya Mart-Mayıs)
- Yerel restoranlarda yemek yiyin
- Toplu taşıma kullanın
- Müze Kart alın`,
    contentEn: `A holiday doesn't have to be expensive. Turkey is a paradise offering options for every budget.

## 1. Black Sea Plateaus

**Why Cheap?** Local pensions from 500 TL. Food is natural and affordable.

**Suggestions:**
- Ayder Plateau
- Uzungöl
- Pokut Plateau

**Avg Daily Budget:** 800-1200 TL

## 2. Mardin

**Why Cheap?** The most authentic city in the Southeast. Prices 40% cheaper than tourist areas.

**Suggestions:**
- Mardin stone houses
- Midyat
- Deyrulzafaran Monastery

**Avg Daily Budget:** 700-1000 TL

## 3. Safranbolu

**Why Cheap?** Despite being UNESCO heritage, prices are reasonable. Stay in historic mansions.

**Suggestions:**
- Historic bazaar
- Hıdırlık Hill
- Lokum shopping

**Avg Daily Budget:** 600-1000 TL

## 4. Şirince (Selçuk)

**Why Cheap?** Close to Ephesus but much more reasonable. Wine tasting and village breakfast.

**Suggestions:**
- Şirince houses
- Ephesus Ancient City (nearby)
- Şirince wines

**Avg Daily Budget:** 700-1100 TL

## 5. Datça

**Why Cheap?** Choose Datça over crowded and expensive Bodrum.

**Suggestions:**
- Knidos Ancient City
- Palamutbükü Beach
- Datça center

**Avg Daily Budget:** 900-1300 TL

## General Savings Tips

- Travel off-season (Sep-Nov or Mar-May)
- Eat at local restaurants
- Use public transport
- Get a Museum Card`,
    coverImage:
      'https://images.unsplash.com/photo-1596178060671-7a80dc8055e6?w=1200&q=80',
    category: 'Bütçe Rehberi',
    categoryEn: 'Budget Guide',
    readTime: 9,
    date: '2025-04-05',
    author: 'İzgeTour Ekibi',
    tags: ['ucuz tatil', 'bütçe', 'Türkiye', 'seyahat'],
    tagsEn: ['budget holiday', 'budget', 'Turkey', 'travel'],
    relatedSlugs: ['kapadokya-sirt-cantasi-rehberi', 'antalya-plaj-rehberi'],
  },
  {
    id: 'seyahat-sigorta-rehberi',
    slug: 'seyahat-sigorta-rehberi',
    title: 'Seyahat Sigortası Rehberi: Yurtdışında Sağlık Güvenceniz',
    titleEn: 'Travel Insurance Guide: Your Health Security Abroad',
    summary:
      'Yurtdışı seyahatlerinde seyahat sigortası neden önemli, nelere dikkat etmeli ve en iyi poliçe seçenekleri.',
    summaryEn:
      'Why travel insurance matters for international trips, what to look for, and the best policy options.',
    content: `Seyahat sigortası, yurtdışına çıkarken çoğu kişinin ihmal ettiği ama en kritik hazırlıklardan biri.

## Neden Seyahat Sigortası?

Bir tatil beldesinde geçireceğiniz basit bir kazada hastane masrafları on binlerce Euro'yu bulabilir. Seyahat sigortası sizi bu tür beklenmedik masraflara karşı korur.

## Kapsaması Gereken Temel Maddeler

1. **Acil Sağlık Hizmetleri** - En az 50.000 EUR teminat
2. **Acil Diş Tedavisi** - En az 500 EUR
3. **Kaza ve Hastalık Nakli** - Türkiye'ye dönüş dahil
4. **Bagaj Kaybı/Gecikmesi** - En az 1.000 EUR
5. **Uçuş İptali/Gecikmesi** - En az 500 EUR
6. **Hukuki Yardım** - En az 5.000 EUR

## Schengen Vizesi İçin Zorunlu

Schengen vizesi başvurusunda seyahat sağlık sigortası **zorunludur**:
- En az 30.000 EUR teminat
- Tüm Schengen bölgesinde geçerli
- Acil sağlık hizmetleri ve geri gönderme masraflarını kapsamalı

## Sigorta Seçerken Dikkat Edilecekler

- **Kronik hastalıklar** poliçede belirtilmeli
- **Ekstrem sporlar** (rafting, dağcılık, tüplü dalış) ek teminat gerektirir
- **Pandemi kapsamı** sorgulanmalı
- **Yurt dışı telefon desteği** 7/24 olmalı

## İpuçları

- Poliçeyi seyahatten en geç 1 gün önce yaptırın
- Seyahat boyunca poliçe belgenizi ve acil durum numarasını yanınızda taşıyın
- Özellikle yaşlı yolcular ve çocuklu aileler için kapsamlı poliçeler tercih edin
- Her durumda önce sigorta şirketinizi arayın, doğrudan hastaneye gitmeyin`,
    contentEn: `Travel insurance is one of the most critical yet neglected preparations for international travel.

## Why Travel Insurance?

A simple accident in a resort town can result in hospital bills worth tens of thousands of Euros. Travel insurance protects you against such unexpected expenses.

## Essential Coverage Items

1. **Emergency Health Services** - Minimum 50,000 EUR coverage
2. **Emergency Dental Treatment** - Minimum 500 EUR
3. **Accident and Illness Repatriation** - Including return to Turkey
4. **Baggage Loss/Delay** - Minimum 1,000 EUR
5. **Flight Cancellation/Delay** - Minimum 500 EUR
6. **Legal Assistance** - Minimum 5,000 EUR

## Mandatory for Schengen Visa

Travel health insurance is **mandatory** for Schengen visa applications:
- Minimum 30,000 EUR coverage
- Valid in all Schengen area
- Must cover emergency health services and repatriation costs

## What to Consider When Choosing Insurance

- **Chronic conditions** must be stated in the policy
- **Extreme sports** (rafting, mountaineering, scuba diving) require additional coverage
- **Pandemic coverage** should be checked
- **Overseas phone support** should be 24/7

## Tips

- Purchase the policy at least 1 day before travel
- Carry your policy document and emergency number throughout your trip
- Choose comprehensive policies especially for elderly travelers and families with children
- Always call your insurance company first, don't go directly to the hospital`,
    coverImage:
      'https://images.unsplash.com/photo-1656464868371-602a274a1b6e?w=1200&q=80',
    category: 'Genel',
    categoryEn: 'General',
    readTime: 6,
    date: '2025-03-25',
    author: 'İzgeTour Ekibi',
    tags: ['sigorta', 'seyahat', 'sağlık', 'güvenlik'],
    tagsEn: ['insurance', 'travel', 'health', 'safety'],
    relatedSlugs: ['vize-basvuru-rehberi', 'turkiye-ucuz-tatil'],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  if (!post.relatedSlugs || post.relatedSlugs.length === 0) return [];
  return BLOG_POSTS.filter((p) => post.relatedSlugs!.includes(p.slug)).slice(0, 3);
}

export const BLOG_CATEGORIES = [
  { key: 'Seyahat Rehberi', keyEn: 'Travel Guide' },
  { key: 'Şehir Rehberi', keyEn: 'City Guide' },
  { key: 'Vize Rehberi', keyEn: 'Visa Guide' },
  { key: 'Plaj Rehberi', keyEn: 'Beach Guide' },
  { key: 'Bütçe Rehberi', keyEn: 'Budget Guide' },
  { key: 'Genel', keyEn: 'General' },
];
