export type DriverStatus = "ACTIVE" | "ON_LEAVE" | "TERMINATED";


export type DriverAssignmentHistoryItem = {
  id: string;
  vehicleId: string;
  vehicleLabel: string;
  from: string; 
  to?: string; 
};

export type DriverMetrics = {
  avgFuelEfficiency: number;  
  maintenanceIncidents: number; 
  utilizationScore: number;       
};
export type Driver = {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: DriverStatus;
  assignedVehicleIds: string[];
  assignmentHistory: DriverAssignmentHistoryItem[];
};
