'use client';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpentTRY: number;
  lastBookingDate: string;
  status: 'active' | 'inactive';
}

export interface CustomerBooking {
  id: string;
  tour: string;
  tourEn: string;
  travelDate: string;
  totalAmountTRY: number;
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'cancelled';
  pnr: string;
  createdAt: string;
}

export const mockCustomers: Customer[] = [
  {
    id: 'C-001',
    name: 'Ali Yılmaz',
    email: 'ali.yilmaz@outlook.com',
    phone: '+90 532 123 45 67',
    totalBookings: 5,
    totalSpentTRY: 67_250,
    lastBookingDate: '2026-04-10',
    status: 'active',
  },
  {
    id: 'C-002',
    name: 'Ayşe Karanfil',
    email: 'ayse.karanfil@gmail.com',
    phone: '+90 536 987 65 43',
    totalBookings: 3,
    totalSpentTRY: 42_800,
    lastBookingDate: '2026-04-12',
    status: 'active',
  },
  {
    id: 'C-003',
    name: 'Mehmet Demirtaş',
    email: 'mehmet.demirtas@proton.me',
    phone: '+90 533 456 78 90',
    totalBookings: 8,
    totalSpentTRY: 124_600,
    lastBookingDate: '2026-04-14',
    status: 'active',
  },
  {
    id: 'C-004',
    name: 'Zeynep Şahin',
    email: 'zeynep.sahin@yahoo.com',
    phone: '+90 505 234 56 78',
    totalBookings: 2,
    totalSpentTRY: 18_900,
    lastBookingDate: '2025-11-20',
    status: 'inactive',
  },
  {
    id: 'C-005',
    name: 'Can Öztürk',
    email: 'can.ozturk@hotmail.com',
    phone: '+90 530 111 22 33',
    totalBookings: 6,
    totalSpentTRY: 89_400,
    lastBookingDate: '2026-04-18',
    status: 'active',
  },
  {
    id: 'C-006',
    name: 'Elif Korkmaz',
    email: 'elif.korkmaz@gmail.com',
    phone: '+90 535 444 55 66',
    totalBookings: 4,
    totalSpentTRY: 55_200,
    lastBookingDate: '2026-04-20',
    status: 'active',
  },
  {
    id: 'C-007',
    name: 'Burak Yıldırım',
    email: 'burak.yildirim@icloud.com',
    phone: '+90 537 777 88 99',
    totalBookings: 1,
    totalSpentTRY: 12_500,
    lastBookingDate: '2025-09-05',
    status: 'inactive',
  },
  {
    id: 'C-008',
    name: 'Selin Aktaş',
    email: 'selin.aktas@outlook.com',
    phone: '+90 531 222 33 44',
    totalBookings: 7,
    totalSpentTRY: 98_750,
    lastBookingDate: '2026-03-28',
    status: 'active',
  },
  {
    id: 'C-009',
    name: 'Emre Aydın',
    email: 'emre.aydin@gmail.com',
    phone: '+90 538 555 66 77',
    totalBookings: 3,
    totalSpentTRY: 34_100,
    lastBookingDate: '2026-01-15',
    status: 'inactive',
  },
  {
    id: 'C-010',
    name: 'Deniz Güneş',
    email: 'deniz.gunes@proton.me',
    phone: '+90 534 888 99 00',
    totalBookings: 9,
    totalSpentTRY: 145_800,
    lastBookingDate: '2026-04-25',
    status: 'active',
  },
  {
    id: 'C-011',
    name: 'İrem Koç',
    email: 'irem.koc@hotmail.com',
    phone: '+90 532 999 00 11',
    totalBookings: 2,
    totalSpentTRY: 21_600,
    lastBookingDate: '2025-12-10',
    status: 'inactive',
  },
  {
    id: 'C-012',
    name: 'Tolga Arslan',
    email: 'tolga.arslan@gmail.com',
    phone: '+90 536 111 22 33',
    totalBookings: 4,
    totalSpentTRY: 48_300,
    lastBookingDate: '2026-02-20',
    status: 'active',
  },
  {
    id: 'C-013',
    name: 'Melis Çelik',
    email: 'melis.celik@icloud.com',
    phone: '+90 533 333 44 55',
    totalBookings: 6,
    totalSpentTRY: 82_900,
    lastBookingDate: '2026-04-05',
    status: 'active',
  },
  {
    id: 'C-014',
    name: 'Kaan Yılmaz',
    email: 'kaan.yilmaz@outlook.com',
    phone: '+90 530 666 77 88',
    totalBookings: 1,
    totalSpentTRY: 9_800,
    lastBookingDate: '2026-03-10',
    status: 'active',
  },
  {
    id: 'C-015',
    name: 'Nazlı Demir',
    email: 'nazli.demir@gmail.com',
    phone: '+90 537 222 33 44',
    totalBookings: 5,
    totalSpentTRY: 71_200,
    lastBookingDate: '2025-10-18',
    status: 'inactive',
  },
];

// Son 3 rezervasyonu döndüren yardımcı fonksiyon
export function getCustomerRecentBookings(customerId: string): CustomerBooking[] {
  // Mock rezervasyonları filtrele
  const customerMap: Record<string, CustomerBooking[]> = {
    'C-001': [
      {
        id: 'BK-001',
        tour: 'Kapadokya Balon Turu',
        tourEn: 'Cappadocia Balloon Tour',
        travelDate: '2026-06-15',
        totalAmountTRY: 12_500,
        paymentStatus: 'paid',
        pnr: 'IZG-2026-001',
        createdAt: '2026-04-10',
      },
      {
        id: 'BK-010',
        tour: 'İstanbul Kültür Turu',
        tourEn: 'Istanbul Culture Tour',
        travelDate: '2026-09-01',
        totalAmountTRY: 8_900,
        paymentStatus: 'paid',
        pnr: 'IZG-2026-010',
        createdAt: '2026-01-20',
      },
      {
        id: 'BK-011',
        tour: 'Antalya Sahil Tatili',
        tourEn: 'Antalya Beach Holiday',
        travelDate: '2025-08-10',
        totalAmountTRY: 34_500,
        paymentStatus: 'paid',
        pnr: 'IZG-2025-011',
        createdAt: '2025-05-15',
      },
    ],
    'C-003': [
      {
        id: 'BK-003',
        tour: 'İstanbul Kültür Turu',
        tourEn: 'Istanbul Culture Tour',
        travelDate: '2026-05-20',
        totalAmountTRY: 8_900,
        paymentStatus: 'pending',
        pnr: 'IZG-2026-003',
        createdAt: '2026-04-14',
      },
      {
        id: 'BK-012',
        tour: 'Ege Kıyıları Tatil Paketi',
        tourEn: 'Aegean Coast Holiday Package',
        travelDate: '2026-07-01',
        totalAmountTRY: 28_400,
        paymentStatus: 'paid',
        pnr: 'IZG-2026-012',
        createdAt: '2026-03-01',
      },
      {
        id: 'BK-013',
        tour: 'Karadeniz Yayla Turu',
        tourEn: 'Black Sea Plateau Tour',
        travelDate: '2026-06-30',
        totalAmountTRY: 16_200,
        paymentStatus: 'paid',
        pnr: 'IZG-2026-013',
        createdAt: '2025-12-15',
      },
    ],
    'C-010': [
      {
        id: 'BK-014',
        tour: 'Kapadokya Balon Turu',
        tourEn: 'Cappadocia Balloon Tour',
        travelDate: '2026-06-15',
        totalAmountTRY: 12_500,
        paymentStatus: 'paid',
        pnr: 'IZG-2026-014',
        createdAt: '2026-04-25',
      },
      {
        id: 'BK-015',
        tour: 'Antalya Sahil Tatili',
        tourEn: 'Antalya Beach Holiday',
        travelDate: '2026-08-10',
        totalAmountTRY: 34_500,
        paymentStatus: 'paid',
        pnr: 'IZG-2026-015',
        createdAt: '2026-02-10',
      },
      {
        id: 'BK-016',
        tour: 'Ege Kıyıları Tatil Paketi',
        tourEn: 'Aegean Coast Holiday Package',
        travelDate: '2025-07-01',
        totalAmountTRY: 28_400,
        paymentStatus: 'paid',
        pnr: 'IZG-2025-016',
        createdAt: '2025-04-20',
      },
    ],
  };

  return customerMap[customerId] || [];
}
