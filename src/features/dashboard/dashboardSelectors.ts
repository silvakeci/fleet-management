import type { Vehicle } from "../../types/vehicle";
import { getAssignmentHistory, getMaintenanceHistory } from "../vehicles/vehicleDetailsMock";

function daysBetween(a: string, b: string) {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.floor((db - da) / (1000 * 60 * 60 * 24));
}

function addDays(date: string, days: number) {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export type DashboardData = {
  total: number;
  active: number;
  maint: number;
  retired: number;
  dueSoon: Vehicle[];
  overdue: Vehicle[];

  totalMileage: number;
  avgAge: number;
  monthlyMaintenanceCost: number;

  lastAdded: Vehicle[];
  recentMaintenance: Array<{
    id: string;
    vehicleId: string;
    make: string;
    model: string;
    date: string;
    serviceType: string;
    mileageAtService: number;
    cost: number;
  }>;
  recentAssignments: Array<{
    id: string;
    vehicleId: string;
    make: string;
    model: string;
    driverName: string;
    from: string;
    to?: string;
  }>;
};

export function computeDashboardData(items: Vehicle[]): DashboardData {
  const total = items.length;
  const active = items.filter((v) => v.status === "ACTIVE").length;
  const maint = items.filter((v) => v.status === "MAINTENANCE").length;
  const retired = items.filter((v) => v.status === "RETIRED").length;

  // maintenance due logic
  const SERVICE_INTERVAL_DAYS = 180;
  const DUE_SOON_WINDOW_DAYS = 30;
  const today = todayISO();

  const dueSoon: Vehicle[] = [];
  const overdue: Vehicle[] = [];

  for (const v of items) {
    const dueDate = addDays(v.lastServiceDate, SERVICE_INTERVAL_DAYS);
    const daysUntil = daysBetween(today, dueDate);
    if (daysUntil < 0) overdue.push(v);
    else if (daysUntil <= DUE_SOON_WINDOW_DAYS) dueSoon.push(v);
  }

  // quick stats
  const totalMileage = items.reduce((sum, v) => sum + (v.currentMileage || 0), 0);
  const avgAge =
    total === 0
      ? 0
      : Math.round(
          (items.reduce((sum, v) => sum + (new Date().getFullYear() - v.year), 0) / total) * 10
        ) / 10;

  const last30 = 30;
  const monthlyMaintenanceCost = items.reduce((sum, v) => {
    const records = getMaintenanceHistory(v);
    const recent = records.filter((r) => daysBetween(r.date, today) <= last30);
    return sum + recent.reduce((s, r) => s + r.cost, 0);
  }, 0);

  // recent activity
  const lastAdded = [...items]
    .sort((a, b) => (Number(b.id.replace(/\D/g, "")) || 0) - (Number(a.id.replace(/\D/g, "")) || 0))
    .slice(0, 5);

  const recentMaintenance = items
    .flatMap((v) =>
      getMaintenanceHistory(v).map((r) => ({
        vehicleId: v.id,
        make: v.make,
        model: v.model,
        ...r,
      }))
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const recentAssignments = items
    .flatMap((v) =>
      getAssignmentHistory(v).map((a) => ({
        vehicleId: v.id,
        make: v.make,
        model: v.model,
        ...a,
      }))
    )
    .sort((a, b) => (b.from ?? "").localeCompare(a.from ?? ""))
    .slice(0, 5);

  return {
    total,
    active,
    maint,
    retired,
    dueSoon,
    overdue,
    totalMileage,
    avgAge,
    monthlyMaintenanceCost,
    lastAdded,
    recentMaintenance,
    recentAssignments,
  };
}
