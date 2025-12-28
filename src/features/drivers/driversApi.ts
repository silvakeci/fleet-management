import type { Driver, DriverAssignmentHistoryItem } from "../../types/driver";
import type { Vehicle } from "../../types/vehicle";
import { DRIVER_SEED } from "./mockDrivers";

function isoDateDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function vehicleLabel(v: Vehicle) {
  return `${v.make} ${v.model} · ${v.id}`;
}

export async function fetchDriversApi(vehicles: Vehicle[]): Promise<Driver[]> {
  await new Promise((r) => setTimeout(r, 350));


  const drivers: Driver[] = DRIVER_SEED.map((d) => ({
    ...d,
    assignedVehicleIds: [],
    assignmentHistory: [],
  }));

  const byId = new Map(drivers.map((d) => [d.id, d]));

  for (const v of vehicles) {
    const driverId = v.assignedDriverId; 
    if (!driverId) continue;

    const driver = byId.get(driverId);
    if (!driver) continue;

    if (driver.assignedVehicleIds.length > 0) continue;

    driver.assignedVehicleIds = [v.id];

    const from = isoDateDaysAgo((Number(v.id.replace(/\D/g, "")) % 40) + 5);

    const hist: DriverAssignmentHistoryItem = {
      id: `AH-${driver.id}-${v.id}`,
      vehicleId: v.id,
      vehicleLabel: vehicleLabel(v),
      from,
      to: undefined, 
    };

    driver.assignmentHistory.unshift(hist);
  }

  return drivers;
}
