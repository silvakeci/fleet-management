import type { Vehicle } from "../../types/vehicle";
import type { Driver } from "../../types/driver";
import type { MaintenanceRecord } from "../../types/maintenance";

export type DashboardData = {
  // summary counts
  total: number;
  active: number;
  maint: number;
  retired: number;

  // service alerts based on lastServiceDate
  dueSoon: Vehicle[];
  overdue: Vehicle[];

  // quick stats
  totalMileage: number;
  avgAge: number;
  monthlyMaintenanceCost: number;

  // recent activity
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
    driverId: string;
    driverName: string;
    from: string;
    to?: string;
  }>;
};

function daysBetween(aISO: string, bISO: string) {
  const a = new Date(aISO);
  const b = new Date(bISO);
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function safeNumber(n: unknown, fallback = 0) {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

function pickLast5ByIdDesc<T extends { id: string }>(items: T[]) {
  // Works for ids like V-0001... V-0360
  const num = (id: string) => Number(id.replace(/\D/g, "")) || 0;
  return [...items].sort((a, b) => num(b.id) - num(a.id)).slice(0, 5);
}

/**
 * ✅ Main dashboard selector builder (used by DashboardPage)
 * Pass slices: vehicles, drivers, maintenance
 */
export function computeDashboardData(
  vehicles: Vehicle[],
  drivers: Driver[],
  maintenance: MaintenanceRecord[]
): DashboardData {
  const total = vehicles.length;
  const active = vehicles.filter((v) => v.status === "ACTIVE").length;
  const maint = vehicles.filter((v) => v.status === "MAINTENANCE").length;
  const retired = vehicles.filter((v) => v.status === "RETIRED").length;

  // Due soon / overdue based on lastServiceDate
  const today = todayISO();
  // Example policy:
  // - due soon = last service was 335+ days ago (within ~30 days of yearly service)
  // - overdue = last service was 365+ days ago
  const dueSoon = vehicles.filter((v) => {
    const d = v.lastServiceDate;
    if (!d) return false;
    const age = daysBetween(d, today);
    return age >= 335 && age < 365;
  });

  const overdue = vehicles.filter((v) => {
    const d = v.lastServiceDate;
    if (!d) return false;
    const age = daysBetween(d, today);
    return age >= 365;
  });

  // Quick stats
  const totalMileage = vehicles.reduce((sum, v) => sum + safeNumber(v.currentMileage, 0), 0);

  const currentYear = new Date().getFullYear();
  const avgAge =
    total === 0
      ? 0
      : Math.round(
          vehicles.reduce((sum, v) => sum + (currentYear - safeNumber(v.year, currentYear)), 0) / total
        );

  // Monthly maintenance cost from COMPLETED records in last 30 days
  const monthlyMaintenanceCost = maintenance
    .filter((m) => m.status === "COMPLETED" && (m.completedDate || m.scheduledDate))
    .filter((m) => {
      const date = (m.completedDate || m.scheduledDate) as string;
      const age = daysBetween(date, today);
      return age >= 0 && age <= 30;
    })
    .reduce((sum, m) => sum + safeNumber(m.cost, 0), 0);

  // Recent vehicles added (approx by highest ID)
  const lastAdded = pickLast5ByIdDesc(vehicles);

  // Recent maintenance (latest 5)
  const recentMaintenance = [...maintenance]
    .filter((m) => m.status === "COMPLETED")
    .sort((a, b) => {
      const da = (a.completedDate || a.scheduledDate || "").toString();
      const db = (b.completedDate || b.scheduledDate || "").toString();
      return db.localeCompare(da);
    })
    .slice(0, 5)
    .map((m) => {
      const v = vehicles.find((x) => x.id === m.vehicleId);
      return {
        id: m.id,
        vehicleId: m.vehicleId,
        make: v?.make ?? "Unknown",
        model: v?.model ?? "",
        date: (m.completedDate || m.scheduledDate || "").toString(),
        serviceType: m.serviceType,
        mileageAtService: safeNumber(m.mileageAtService, 0),
        cost: safeNumber(m.cost, 0),
      };
    });

  // Recent assignments based on drivers assignment history if you have it.
  // If you *don’t* store history yet, this falls back to current assignments.
  const recentAssignments = (() => {
    // If your Driver type later includes assignmentHistory, this will use it
    const anyWithHistory = (drivers as any[]).some((d) => Array.isArray(d.assignmentHistory));
    if (anyWithHistory) {
      const all = (drivers as any[]).flatMap((d) =>
        (d.assignmentHistory as any[]).map((h) => ({
          driverId: d.id,
          driverName: d.name,
          ...h,
        }))
      );

      return all
        .sort((a, b) => (b.from || "").localeCompare(a.from || ""))
        .slice(0, 5)
        .map((a) => {
          const v = vehicles.find((x) => x.id === a.vehicleId);
          return {
            id: a.id,
            vehicleId: a.vehicleId,
            make: v?.make ?? "Unknown",
            model: v?.model ?? "",
            driverId: a.driverId,
            driverName: a.driverName,
            from: a.from,
            to: a.to,
          };
        });
    }

    // fallback: use current assignments (still “real time”)
    const current = drivers
      .filter((d) => (d.assignedVehicleIds?.[0] ? true : false))
      .map((d) => {
        const vehicleId = d.assignedVehicleIds[0];
        const v = vehicles.find((x) => x.id === vehicleId);
        return {
          id: `A-${d.id}-${vehicleId}`,
          vehicleId,
          make: v?.make ?? "Unknown",
          model: v?.model ?? "",
          driverId: d.id,
          driverName: d.name,
          from: today, // unknown without history, so use today
          to: undefined,
        };
      })
      .slice(0, 5);

    return current;
  })();

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
