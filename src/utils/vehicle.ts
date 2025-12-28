import type { VehicleStatus } from "../types/vehicle";

export function makeVin(i: number) {
  const base = `FLEET${String(i).padStart(12, "0")}`;
  return base.slice(0, 17);
}

export function statusFrom(i: number): VehicleStatus {
  const mod = i % 12;
  if (mod === 0) return "RETIRED";
  if (mod <= 2) return "MAINTENANCE";
  return "ACTIVE";
}
