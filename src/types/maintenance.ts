export type MaintenanceStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";

export type MaintenanceServiceType =
  | "OIL_CHANGE"
  | "TIRE_ROTATION"
  | "INSPECTION"
  | "REPAIR";

export type MaintenanceRecord = {
  id: string;
  vehicleId: string;
  scheduledDate: string; 
  serviceType: MaintenanceServiceType;
  status: MaintenanceStatus;
  cost: number;
  mileageAtService: number;
  technician: string;
  notes?: string;
  completedDate?: string; 
};
