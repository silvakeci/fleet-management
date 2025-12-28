import type { MaintenanceRecord } from "../../../types/maintenance";
import type { Vehicle } from "../../../types/vehicle";
import StatusBadge from "./StatusBadge";

export default function MaintenanceScheduleList({
  items,
  vehiclesById,
  onOpenVehicle,
}: {
  items: MaintenanceRecord[];
  vehiclesById: Record<string, Vehicle | undefined>;
  onOpenVehicle: (vehicleId: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <div className="text-lg font-semibold">No scheduled maintenance</div>
        <div className="text-sm text-slate-500 mt-1">Nothing matches your filters.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((r) => {
        const v = vehiclesById[r.vehicleId];
        return (
          <div
            key={r.id}
            className="rounded-xl border bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer hover:bg-slate-50"
            onClick={() => onOpenVehicle(r.vehicleId)}
            role="button"
          >
            <div>
              <div className="font-semibold">
                {v ? `${v.make} ${v.model}` : "Vehicle"} · {r.vehicleId}
              </div>
              <div className="text-sm text-slate-500">
                {r.scheduledDate} · {r.serviceType.replaceAll("_", " ")}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={r.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
