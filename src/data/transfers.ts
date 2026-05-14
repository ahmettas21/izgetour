// Airport transfer types used by PredictiveTripBundler

export type TransferType = 'private' | 'shared' | 'vip';

export interface Transfer {
  id: string;
  type: TransferType;
  vehicle: string;
  vehicleEn: string;
  pricePerPerson: number;
  totalPrice: number;
  duration: number; // minutes
  description: string;
  descriptionEn: string;
}
