'use client';

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  tour: string;
  tourEn: string;
  travelDate: string;
  totalAmountTRY: number;
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'cancelled';
  pnr: string;
  createdAt: string;
  notes?: string;
}

export const mockBookings: Booking[] = [
  {
    id: 'BK-001',
    customerName: 'Ali Yılmaz',
    customerEmail: 'ali@example.com',
    tour: 'Kapadokya Balon Turu',
    tourEn: 'Cappadocia Balloon Tour',
    travelDate: '2026-06-15',
    totalAmountTRY: 12500,
    paymentStatus: 'paid',
    pnr: 'IZG-2026-001',
    createdAt: '2026-04-10',
  },
  {
    id: 'BK-002',
    customerName: 'Ayşe Karanfil',
    customerEmail: 'ayse@example.com',
    tour: 'Ege Kıyıları Tatil Paketi',
    tourEn: 'Aegean Coast Holiday Package',
    travelDate: '2026-07-01',
    totalAmountTRY: 28400,
    paymentStatus: 'paid',
    pnr: 'IZG-2026-002',
    createdAt: '2026-04-12',
  },
  {
    id: 'BK-003',
    customerName: 'Mehmet Demirtaş',
    customerEmail: 'mehmet@example.com',
    tour: 'İstanbul Kültür Turu',
    tourEn: 'Istanbul Culture Tour',
    travelDate: '2026-05-20',
    totalAmountTRY: 8900,
    paymentStatus: 'pending',
    pnr: 'IZG-2026-003',
    createdAt: '2026-04-14',
  },
  {
    id: 'BK-004',
    customerName: 'Zeynep Şahin',
    customerEmail: 'zeynep@example.com',
    tour: 'Antalya Sahil Tatili',
    tourEn: 'Antalya Beach Holiday',
    travelDate: '2026-08-10',
    totalAmountTRY: 34500,
    paymentStatus: 'refunded',
    pnr: 'IZG-2026-004',
    createdAt: '2026-04-15',
    notes: 'İptal talebi alındı, iade sürecinde',
  },
  {
    id: 'BK-005',
    customerName: 'Can Öztürk',
    customerEmail: 'can@example.com',
    tour: 'Kapadokya Balon Turu',
    tourEn: 'Cappadocia Balloon Tour',
    travelDate: '2026-06-20',
    totalAmountTRY: 12500,
    paymentStatus: 'cancelled',
    pnr: 'IZG-2026-005',
    createdAt: '2026-04-18',
    notes: 'Müşteri kaynaklı iptal',
  },
  {
    id: 'BK-006',
    customerName: 'Elif Korkmaz',
    customerEmail: 'elif@example.com',
    tour: 'Karadeniz Yayla Turu',
    tourEn: 'Black Sea Plateau Tour',
    travelDate: '2026-07-15',
    totalAmountTRY: 16200,
    paymentStatus: 'paid',
    pnr: 'IZG-2026-006',
    createdAt: '2026-04-20',
  },
];
