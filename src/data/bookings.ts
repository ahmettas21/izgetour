export interface Booking {
  id: string;
  type: "tour" | "hotel" | "flight" | "visa";
  status: "confirmed" | "pending" | "cancelled" | "completed";
  date: string;
  amount: number;
  description: string;
  descriptionEn: string;
}

export const bookings: Booking[] = [
  {
    id: "B-1001",
    type: "hotel",
    status: "confirmed",
    date: "2026-06-15",
    amount: 12500,
    description: "Grand Palace Antalya - 3 Gece Süit Oda",
    descriptionEn: "Grand Palace Antalya - 3 Nights Suite Room",
  },
  {
    id: "B-1002",
    type: "tour",
    status: "completed",
    date: "2026-04-10",
    amount: 3400,
    description: "Kapadokya Balon Turu - 2 Kişi",
    descriptionEn: "Cappadocia Balloon Tour - 2 People",
  },
  {
    id: "B-1003",
    type: "flight",
    status: "confirmed",
    date: "2026-07-01",
    amount: 6800,
    description: "İstanbul - Antalya Gidiş-Dönüş",
    descriptionEn: "Istanbul - Antalya Round Trip",
  },
  {
    id: "B-1004",
    type: "visa",
    status: "pending",
    date: "2026-05-20",
    amount: 8500,
    description: "Schengen Vize Başvurusu",
    descriptionEn: "Schengen Visa Application",
  },
  {
    id: "B-1005",
    type: "hotel",
    status: "cancelled",
    date: "2026-03-01",
    amount: 4500,
    description: "İstanbul Boğaz Oteli - Standart Oda",
    descriptionEn: "Istanbul Bosphorus Hotel - Standard Room",
  },
];
