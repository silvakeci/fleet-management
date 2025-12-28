import type { Vehicle } from "../../../../types/vehicle";
import { DRIVER_SEED } from "../../../drivers/mockDrivers";

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

function seedFromVehicleId(vehicleId: string) {
  const n = Number(vehicleId.replace(/\D/g, "")) || 7;
  return n;
}

function pickStable<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}


export function getVehicleAssignmentHistory(vehicle: Vehicle): VehicleAssignment[] {
  const seed = seedFromVehicleId(vehicle.id);

  const activeDrivers = DRIVER_SEED.filter((d) => d.status === "ACTIVE");
  const pool = activeDrivers.length ? activeDrivers : DRIVER_SEED;

  const currentName = vehicle.assignedDriverName;

  const historyCount = seed % 4;
  const history: VehicleAssignment[] = [];

  let cursor = 420 + (seed % 120);

  for (let i = 0; i < historyCount; i++) {
    const d = pickStable(pool, seed + i * 11);

    const from = isoDaysAgo(cursor);
    const to = isoDaysAgo(cursor - (60 + ((seed + i) % 120)));

    history.push({
      id: `${vehicle.id}-hist-${i}`,
      driverId: d.id,
      driverName: d.name,
      from,
      to,
    });

    cursor -= 90 + ((seed + i) % 60);
  }

  if (currentName) {
    const currentDriver =
      DRIVER_SEED.find((x) => x.name === currentName) ?? pickStable(pool, seed + 99);

    history.push({
      id: `${vehicle.id}-current`,
      driverId: currentDriver.id,
      driverName: currentDriver.name,
      from: isoDaysAgo(30 + (seed % 120)),
      to: undefined,
    });
  }

  return history.sort((a, b) => (b.from).localeCompare(a.from));
}
