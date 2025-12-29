import type {
  MaintenanceRecord,
  MaintenanceServiceType,
  MaintenanceStatus,
} from "../../types/maintenance";
import type { Vehicle } from "../../types/vehicle";

const TYPES: MaintenanceServiceType[] = [
  "OIL_CHANGE",
  "TIRE_ROTATION",
  "INSPECTION",
  "REPAIR",
];

type MaintenanceSchedule = {
  id: string;
  vehicleId: string;
  scheduledDate: string;
  serviceType: MaintenanceServiceType;
  status: Exclude<MaintenanceStatus, "COMPLETED">; 
};

export type MaintenanceItem = MaintenanceRecord | MaintenanceSchedule;

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

export function isMaintenanceRecord(x: MaintenanceItem): x is MaintenanceRecord {
  return x.status === "COMPLETED";
}

export async function fetchMaintenanceApi(
  vehicles: Vehicle[]
): Promise<MaintenanceItem[]> {
  await new Promise((r) => setTimeout(r, 500));

  const items: MaintenanceItem[] = [];
  const today = new Date();
  let idNum = 1;

  for (const v of vehicles.slice(0, Math.min(vehicles.length, 80))) {
    const numericId = Number(v.id.replace(/\D/g, "")) || 0;

    const completedCount = 1 + (numericId % 3);
    for (let i = 0; i < completedCount; i++) {
      const daysAgo = 30 + i * 40 + (numericId % 12);
      const date = new Date();
      date.setDate(today.getDate() - daysAgo);

      items.push(
        {
          id: `M-${String(idNum++).padStart(5, "0")}`,
          vehicleId: v.id,
          scheduledDate: iso(date),
          completedDate: iso(date),
          serviceType: pick(TYPES),
          status: "COMPLETED",
          cost: 80 + (idNum % 420),
          mileageAtService: Math.max(
            1,
            v.currentMileage - (500 + (idNum % 6000))
          ),
          technician: `Tech ${1 + (idNum % 9)}`,
          notes: "Routine service completed.",
        } satisfies MaintenanceRecord
      );
    }

    const upcomingCount = (numericId % 2) + 1;
    for (let i = 0; i < upcomingCount; i++) {
      const offset = (numericId % 25) + i * 10 - 10;
      const date = addDays(offset);

      const status: Exclude<MaintenanceStatus, "COMPLETED"> =
        offset < 0 ? "OVERDUE" : offset < 3 ? "IN_PROGRESS" : "SCHEDULED";

      items.push(
        {
          id: `M-${String(idNum++).padStart(5, "0")}`,
          vehicleId: v.id,
          scheduledDate: iso(date),
          serviceType: pick(TYPES),
          status,
        } satisfies MaintenanceSchedule
      );
    }
  }

  return items.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
}
