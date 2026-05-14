'use client';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
  avatar?: string;
  createdAt: string;
}

export const admins: Admin[] = [
  {
    id: 'A-001',
    name: 'Ayşe Demir',
    email: 'ayse.demir@izgetour.com',
    role: 'superadmin',
    avatar: undefined,
    createdAt: '2024-01-15',
  },
  {
    id: 'A-002',
    name: 'Mehmet Kaya',
    email: 'mehmet.kaya@izgetour.com',
    role: 'admin',
    avatar: undefined,
    createdAt: '2024-03-20',
  },
  {
    id: 'A-003',
    name: 'Zeynep Yıldız',
    email: 'zeynep.yildiz@izgetour.com',
    role: 'editor',
    avatar: undefined,
    createdAt: '2024-06-10',
  },
];

export interface DashboardStats {
  totalSalesTRY: number;
  activeBookings: number;
  pendingRefunds: number;
  mostPopularTour: string;
  mostPopularTourEn: string;
  totalCustomers: number;
  newCustomersThisMonth: number;
}

export interface WeeklySalesPoint {
  week: string;
  sales: number;
}

export const mockDashboardStats: DashboardStats = {
  totalSalesTRY: 4_820_500,
  activeBookings: 142,
  pendingRefunds: 7,
  mostPopularTour: 'Kapadokya Balon Turu',
  mostPopularTourEn: 'Cappadocia Balloon Tour',
  totalCustomers: 48,
  newCustomersThisMonth: 5,
};

export const mockWeeklySales: WeeklySalesPoint[] = [
  { week: '17 Şub', sales: 68_400 },
  { week: '18 Şub', sales: 74_200 },
  { week: '19 Şub', sales: 91_800 },
  { week: '20 Şub', sales: 85_100 },
  { week: '21 Şub', sales: 112_300 },
  { week: '22 Şub', sales: 98_700 },
  { week: '23 Şub', sales: 76_500 },
];
