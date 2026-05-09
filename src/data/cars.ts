export interface Car {
  id: string;
  name: string;
  nameEn: string;
  type: "sedan" | "suv" | "van";
  pricePerDay: number;
  image: string;
  seats: number;
  transmission: "manual" | "automatic";
  ac: boolean;
}

export const cars: Car[] = [
  {
    id: "1",
    name: "Renault Clio",
    nameEn: "Renault Clio",
    type: "sedan",
    pricePerDay: 950,
    image: "/images/cars/clio.jpg",
    seats: 5,
    transmission: "manual",
    ac: true,
  },
  {
    id: "2",
    name: "Volkswagen Passat",
    nameEn: "Volkswagen Passat",
    type: "sedan",
    pricePerDay: 1500,
    image: "/images/cars/passat.jpg",
    seats: 5,
    transmission: "automatic",
    ac: true,
  },
  {
    id: "3",
    name: "Toyota Rav4",
    nameEn: "Toyota Rav4",
    type: "suv",
    pricePerDay: 2200,
    image: "/images/cars/rav4.jpg",
    seats: 5,
    transmission: "automatic",
    ac: true,
  },
  {
    id: "4",
    name: "Ford Tourneo",
    nameEn: "Ford Tourneo",
    type: "van",
    pricePerDay: 2800,
    image: "/images/cars/tourneo.jpg",
    seats: 9,
    transmission: "manual",
    ac: true,
  },
  {
    id: "5",
    name: "Mercedes Vito",
    nameEn: "Mercedes Vito",
    type: "van",
    pricePerDay: 3500,
    image: "/images/cars/vito.jpg",
    seats: 8,
    transmission: "automatic",
    ac: true,
  },
];
