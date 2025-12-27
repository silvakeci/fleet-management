import type { Vehicle } from "../../types/vehicle";
import type { AssignmentRecord, MaintenanceRecord, ServiceType } from "../../types/vehicleDetails";

const COLORS = ["White", "Black", "Silver", "Blue", "Red", "Gray"];
const SERVICE_TYPES: ServiceType[] = ["OIL", "TIRES", "INSPECTION", "REPAIR"];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

function isoDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function addDays(date: string, days: number) {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function money(seed: number, min: number, max: number) {
  const v = min + (seed % (max - min + 1));
  return Math.round(v);
}

export function getVehicleExtraSpecs(vehicle: Vehicle) {
  const seed = hash(vehicle.id);
  const licensePlate = `AA-${String((seed % 9000) + 1000)}`;
  const color = pick(COLORS, seed);
  const purchaseDate = isoDaysAgo(365 * (2 + (seed % 6))); 
  const avgFuelConsumption = Number((6.5 + (seed % 50) / 10).toFixed(1));
  const totalFuelCost = 2000 + (seed % 18000);

  return { licensePlate, color, purchaseDate, avgFuelConsumption, totalFuelCost };
}

export function getMaintenanceHistory(vehicle: Vehicle): MaintenanceRecord[] {
  const seed = hash(vehicle.id);
  const count = 6 + (seed % 10); 

  const baseMileage = Math.max(8000, vehicle.currentMileage - 60000);
  const records: MaintenanceRecord[] = Array.from({ length: count }).map((_, i) => {
    const s = seed + i * 17;
    const date = isoDaysAgo(20 + i * (15 + (s % 18))); 
    const serviceType = pick(SERVICE_TYPES, s);
    const cost = money(s, 60, 900) + (serviceType === "REPAIR" ? 400 : 0);
    const mileageAtService = baseMileage + i * money(s, 2500, 7500);
    const technicianNotes =
      serviceType === "OIL"
        ? "Oil & filter replaced. Checked fluids and belts."
        : serviceType === "TIRES"
        ? "Rotated tires and checked tire pressure."
        : serviceType === "INSPECTION"
        ? "Routine inspection completed. No major issues found."
        : "Repair completed. Tested vehicle; operating normally.";

    return {
      id: `m_${vehicle.id}_${i}`,
      date,
      serviceType,
      cost,
      mileageAtService,
      technicianNotes,
    };
  });

  return records.sort((a, b) => b.date.localeCompare(a.date));
}

export function getAssignmentHistory(vehicle: Vehicle): AssignmentRecord[] {
  const seed = hash(vehicle.id);
  const count = 2 + (seed % 4); 

  const start = isoDaysAgo(420 + (seed % 120)); 
  const list: AssignmentRecord[] = [];

  let cur = start;
  for (let i = 0; i < count; i++) {
    const s = seed + i * 101;
    const driverName = `Driver ${String((s % 40) + 1).padStart(2, "0")}`;
    const from = cur;
    const duration = 60 + (s % 140);
    const to = i === count - 1 ? undefined : addDays(from, duration);
    list.push({
      id: `a_${vehicle.id}_${i}`,
      driverName,
      from,
      to,
    });
    cur = to ?? cur;
  }

  return list;
}
