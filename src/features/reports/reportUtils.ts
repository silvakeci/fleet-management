import type { Vehicle } from "../../types/vehicle";
import type { MaintenanceRecord, MaintenanceServiceType } from "../../types/maintenance";

export function daysBetween(aISO: string, bISO: string) {
  const a = new Date(aISO + "T00:00:00");
  const b = new Date(bISO + "T00:00:00");
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function groupCount<T extends string | number>(items: T[]) {
  const m = new Map<T, number>();
  for (const x of items) m.set(x, (m.get(x) ?? 0) + 1);
  return m;
}

export function mapToSortedArray<K extends string | number>(m: Map<K, number>) {
  return Array.from(m.entries())
    .map(([k, v]) => ({ key: String(k), value: v }))
    .sort((a, b) => b.value - a.value);
}

export function yearBucket(age: number) {
  if (age <= 1) return "0–1";
  if (age <= 3) return "2–3";
  if (age <= 5) return "4–5";
  if (age <= 8) return "6–8";
  if (age <= 12) return "9–12";
  return "13+";
}

export function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function serviceLabel(t: MaintenanceServiceType) {
  return t.replaceAll("_", " ");
}

export function vehicleLabel(v: Vehicle) {
  return `${v.make} ${v.model} · ${v.id}`;
}

export function maintenanceCompleted(records: MaintenanceRecord[]) {
  return records.filter((r) => r.status === "COMPLETED");
}
