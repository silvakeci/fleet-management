import type { MaintenanceRecord, MaintenanceServiceType, MaintenanceStatus } from "../../types/maintenance";
import type { Vehicle } from "../../types/vehicle";

const TYPES: MaintenanceServiceType[] = ["OIL_CHANGE", "TIRE_ROTATION", "INSPECTION", "REPAIR"];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function fetchMaintenanceApi(vehicles: Vehicle[]): Promise<MaintenanceRecord[]> {
  await new Promise((r) => setTimeout(r, 500));

  const records: MaintenanceRecord[] = [];
  const today = new Date();

  let idNum = 1;

  for (const v of vehicles.slice(0, Math.min(vehicles.length, 80))) {
    const completedCount = 1 + (Number(v.id.replace(/\D/g, "")) % 3);
    for (let i = 0; i < completedCount; i++) {
      const daysAgo = 30 + i * 40 + (Number(v.id.replace(/\D/g, "")) % 12);
      const date = new Date();
      date.setDate(today.getDate() - daysAgo);

      records.push({
        id: `M-${String(idNum++).padStart(5, "0")}`,
        vehicleId: v.id,
        scheduledDate: iso(date),
        completedDate: iso(date),
        serviceType: pick(TYPES),
        status: "COMPLETED",
        cost: 80 + (idNum % 420),
        mileageAtService: Math.max(1, v.currentMileage - (500 + (idNum % 6000))),
        technician: `Tech ${1 + (idNum % 9)}`,
        notes: "Routine service completed.",
      });
    }

    const upcomingCount = (Number(v.id.replace(/\D/g, "")) % 2) + 1;
    for (let i = 0; i < upcomingCount; i++) {
      const offset = (Number(v.id.replace(/\D/g, "")) % 25) + i * 10 - 10; 
      const date = addDays(offset);
      const status: MaintenanceStatus =
        offset < 0 ? "OVERDUE" : offset < 3 ? "IN_PROGRESS" : "SCHEDULED";

      records.push({
        id: `M-${String(idNum++).padStart(5, "0")}`,
        vehicleId: v.id,
        scheduledDate: iso(date),
        serviceType: pick(TYPES),
        status,
      });
    }
  }

  return records.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
}
