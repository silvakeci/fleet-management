export type VehicleStatus = "ACTIVE" | "MAINTENANCE" | "RETIRED";
export type FuelType = "GASOLINE" | "DIESEL" | "ELECTRIC" | "HYBRID";
export type Transmission = "AUTOMATIC" | "MANUAL";

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: VehicleStatus;
  currentMileage: number;
  lastServiceDate: string; 

  licensePlate: string;
  color: string;
  purchaseDate: string; 

  fuelType?: FuelType;
  transmission?: Transmission;
  purchasePrice?: number;
  notes?: string;

  assignedDriverName?: string;
};
