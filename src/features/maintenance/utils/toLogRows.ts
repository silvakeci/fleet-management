import type { MaintenanceRecord } from "../../../types/maintenance";
import type { Vehicle } from "../../../types/vehicle";

export type MaintenanceLogRow = {
  date: string;
  vehicleId: string;
  vehicleLabel: string;
  serviceType: string;
  cost: number;
  mileageAtService: number;
  technician: string;
  notes: string;
};

export function toLogRows(
  records: MaintenanceRecord[],
  vehiclesById: Record<string, Vehicle | undefined>
): MaintenanceLogRow[] {
  return records.map((r) => {
    const v = vehiclesById[r.vehicleId];
    return {
      date: r.completedDate ?? r.scheduledDate,
      vehicleId: r.vehicleId,
      vehicleLabel: v ? `${v.make} ${v.model} · ${r.vehicleId}` : r.vehicleId,
      serviceType: r.serviceType.replaceAll("_", " "),
      cost: r.cost ?? 0,
      mileageAtService: r.mileageAtService ?? 0,
      technician: r.technician ?? "—",
      notes: r.notes ?? "",
    };
  });
}
