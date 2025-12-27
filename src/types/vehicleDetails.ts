export type ServiceType = "OIL" | "TIRES" | "INSPECTION" | "REPAIR";

export type MaintenanceRecord = {
  id: string;
  date: string; 
  serviceType: ServiceType;
  cost: number;
  mileageAtService: number;
  technicianNotes: string;
};

export type AssignmentRecord = {
  id: string;
  driverName: string;
  from: string; 
  to?: string;  
};
