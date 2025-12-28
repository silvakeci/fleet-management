import type { Vehicle } from "../../types/vehicle";
import { DRIVER_SEED } from "../drivers/mockDrivers";

export type VehicleAssignment = {
  id: string;
  driverId: string;
  driverName: string;
  from: string;  
  to?: string;   
};

function isoDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function pickStable<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

function seedFromVehicleId(vehicleId: string) {
  const n = Number(vehicleId.replace(/\D/g, "")) || 7;
  return n;
}

export function getVehicleAssignmentHistory(vehicle: Vehicle): VehicleAssignment[] {
  const seed = seedFromVehicleId(vehicle.id);

  const activeDrivers = DRIVER_SEED.filter((d) => d.status === "ACTIVE");
  const anyDrivers = DRIVER_SEED;

  const currentName = vehicle.assignedDriverName;

  const count = seed % 4; 
  const items: VehicleAssignment[] = [];

  let cursorDaysAgo = 360 + (seed % 120); 
  for (let i = 0; i < count; i++) {
    const d = pickStable(activeDrivers.length ? activeDrivers : anyDrivers, seed + i * 3);
    const from = isoDaysAgo(cursorDaysAgo);
    const to = isoDaysAgo(cursorDaysAgo - (60 + ((seed + i) % 120)));

    items.push({
      id: `${vehicle.id}-as-${i}`,
      driverId: d.id,
      driverName: d.name,
      from,
      to,
    });

    cursorDaysAgo -= 90 + ((seed + i) % 60);
  }

  if (currentName) {
    const currentDriver =
      DRIVER_SEED.find((d) => d.name === currentName) ??
      pickStable(activeDrivers.length ? activeDrivers : anyDrivers, seed + 99);

    items.unshift({
      id: `${vehicle.id}-as-current`,
      driverId: currentDriver.id,
      driverName: currentDriver.name,
      from: isoDaysAgo(30 + (seed % 120)),
      to: undefined,
    });
  }

  return items.sort((a, b) => b.from.localeCompare(a.from));
}
