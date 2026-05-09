export interface User {
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  izgePoints: number;
  joinDate: string;
}

export const currentUser: User = {
  name: "Ahmet Yılmaz",
  nameEn: "Ahmet Yilmaz",
  email: "ahmet.yilmaz@email.com",
  phone: "+90 532 123 45 67",
  izgePoints: 2450,
  joinDate: "2025-09-12",
};
