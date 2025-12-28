import type { MaintenanceRecord } from "../../types/maintenance";

export type ScheduleFilter = "ALL" | "THIS_WEEK" | "THIS_MONTH" | "OVERDUE";

function toDate(s: string) {
  return new Date(s + "T00:00:00");
}

export function filterSchedule(records: MaintenanceRecord[], filter: ScheduleFilter) {
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  const endWeek = new Date(start);
  endWeek.setDate(endWeek.getDate() + 7);

  const endMonth = new Date(start);
  endMonth.setMonth(endMonth.getMonth() + 1);

  if (filter === "OVERDUE") return records.filter((r) => r.status === "OVERDUE");

  if (filter === "THIS_WEEK") {
    return records.filter((r) => {
      const d = toDate(r.scheduledDate);
      return d >= start && d < endWeek;
    });
  }

  if (filter === "THIS_MONTH") {
    return records.filter((r) => {
      const d = toDate(r.scheduledDate);
      return d >= start && d < endMonth;
    });
  }

  return records;
}

export function sortSchedule(records: MaintenanceRecord[], sortBy: "DATE" | "VEHICLE") {
  const copy = [...records];
  if (sortBy === "VEHICLE") return copy.sort((a, b) => a.vehicleId.localeCompare(b.vehicleId));
  return copy.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
}
