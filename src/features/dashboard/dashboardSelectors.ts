import type { Vehicle } from "../../types/vehicle";
import { getVehicleAssignmentHistory } from "../vehicles/vehicleDetails/mock/getVehicleAssignmentHistory";

function vehicleLabel(v: Vehicle) {
  return `${v.make} ${v.model} · ${v.id}`;
}

export type RecentAssignment = {
  vehicleId: string;
  vehicleLabel: string;
  driverName: string;
  date: string; 
};

export type DashboardData = {
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  retiredVehicles: number;

  vehiclesServiceSoon: number;  
  overdueMaintenance: number;    

  totalFleetMileage: number;
  averageVehicleAge: number;
  monthlyMaintenanceCost: number;

  last5VehiclesAdded: Vehicle[];
  recentAssignments: RecentAssignment[];
};

export function computeDashboardData(vehicles: Vehicle[]): DashboardData {
  const nowYear = new Date().getFullYear();

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === "ACTIVE").length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === "MAINTENANCE").length;
  const retiredVehicles = vehicles.filter((v) => v.status === "RETIRED").length;

  const daysSinceService = (dateStr?: string) => {
    if (!dateStr) return null;
    const t = new Date(dateStr).getTime();
    if (Number.isNaN(t)) return null;
    const days = (Date.now() - t) / (1000 * 60 * 60 * 24);
    return Math.floor(days);
  };

  const vehiclesServiceSoon = vehicles.filter((v) => {
    const days = daysSinceService(v.lastServiceDate);
    if (days === null) return false;
    return days >= 335 && days < 365;
  }).length;

  const overdueMaintenance = vehicles.filter((v) => {
    const days = daysSinceService(v.lastServiceDate);
    if (days === null) return false;
    return days >= 365;
  }).length;

  const totalFleetMileage = vehicles.reduce((acc, v) => acc + (v.currentMileage ?? 0), 0);

  const averageVehicleAge =
    vehicles.length === 0
      ? 0
      : vehicles.reduce((acc, v) => acc + Math.max(0, nowYear - v.year), 0) / vehicles.length;

  const monthlyMaintenanceCost = 12000 + (totalVehicles % 13) * 380;

  const last5VehiclesAdded = [...vehicles]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  const recentAssignments: RecentAssignment[] = (() => {
    const all: RecentAssignment[] = [];

    for (const v of vehicles) {
      const hist = getVehicleAssignmentHistory(v);
      const latest = hist[0]; 
      if (!latest) continue;

      all.push({
        vehicleId: v.id,
        vehicleLabel: vehicleLabel(v),
        driverName: latest.driverName,
        date: latest.from,
      });
    }

    all.sort((a, b) => b.date.localeCompare(a.date));
    return all.slice(0, 5);
  })();

  return {
    totalVehicles,
    activeVehicles,
    maintenanceVehicles,
    retiredVehicles,

    vehiclesServiceSoon,
    overdueMaintenance,

    totalFleetMileage,
    averageVehicleAge,
    monthlyMaintenanceCost,

    last5VehiclesAdded,
    recentAssignments,
  };
}
