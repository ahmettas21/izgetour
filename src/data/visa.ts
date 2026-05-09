export interface Country {
  id: string;
  country: string;
  countryEn: string;
  flag: string;
  requirements: string[];
  processingTime: string;
  processingTimeEn: string;
  price: number;
}

export const visaCountries: Country[] = [
  {
    id: "1",
    country: "Amerika Birleşik Devletleri",
    countryEn: "United States",
    flag: "🇺🇸",
    requirements: [
      "Pasaport (en az 6 ay geçerli)",
      "DS-160 formu",
      "Vize ücreti dekontu",
      "Biyometrik fotoğraf",
      "Banka hesap dökümü",
      "Seyahat sağlık sigortası",
      "Uçak bileti rezervasyonu",
      "Otel rezervasyonu",
    ],
    processingTime: "15-20 iş günü",
    processingTimeEn: "15-20 business days",
    price: 13500,
  },
  {
    id: "2",
    country: "Schengen Bölgesi",
    countryEn: "Schengen Area",
    flag: "🇪🇺",
    requirements: [
      "Pasaport (en az 3 ay geçerli)",
      "Schengen vize başvuru formu",
      "Seyahat sağlık sigortası (30.000€)",
      "Banka hesap dökümü (son 3 ay)",
      "Uçak bileti rezervasyonu",
      "Otel rezervasyonu",
      "Biyometrik fotoğraf",
      "İşveren yazısı / SGV dökümü",
    ],
    processingTime: "10-15 iş günü",
    processingTimeEn: "10-15 business days",
    price: 8500,
  },
  {
    id: "3",
    country: "Birleşik Krallık",
    countryEn: "United Kingdom",
    flag: "🇬🇧",
    requirements: [
      "Pasaport (en az 6 ay geçerli)",
      "UK vize başvuru formu",
      "Biyometrik randevu",
      "Banka hesap dökümü (son 6 ay)",
      "Maaş bordrosu",
      "İşveren yazısı",
      "Seyahat sağlık sigortası",
      "Konaklama kanıtı",
    ],
    processingTime: "15-25 iş günü",
    processingTimeEn: "15-25 business days",
    price: 12000,
  },
  {
    id: "4",
    country: "Dubai / BAE",
    countryEn: "Dubai / UAE",
    flag: "🇦🇪",
    requirements: [
      "Pasaport (en az 6 ay geçerli)",
      "Vize başvuru formu",
      "Biyometrik fotoğraf",
      "Banka hesap dökümü",
      "Uçak bileti rezervasyonu",
      "Otel rezervasyonu",
    ],
    processingTime: "3-5 iş günü",
    processingTimeEn: "3-5 business days",
    price: 3500,
  },
  {
    id: "5",
    country: "Japonya",
    countryEn: "Japan",
    flag: "🇯🇵",
    requirements: [
      "Pasaport (en az 6 ay geçerli)",
      "Vize başvuru formu",
      "Seyahat programı",
      "Banka hesap dökümü (son 6 ay)",
      "Maaş bordrosu",
      "İşveren yazısı",
      "Uçak bileti rezervasyonu",
      "Otel rezervasyonu",
      "Seyahat sağlık sigortası",
    ],
    processingTime: "7-10 iş günü",
    processingTimeEn: "7-10 business days",
    price: 9500,
  },
];
