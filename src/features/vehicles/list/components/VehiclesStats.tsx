import { useMemo } from "react";
import type { Vehicle } from "../../../../types/vehicle";

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-slate-50 border text-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

export default function VehiclesStats({ vehicles }: { vehicles: Vehicle[] }) {
  const counts = useMemo(() => {
    const active = vehicles.filter((v) => v.status === "ACTIVE").length;
    const maint = vehicles.filter((v) => v.status === "MAINTENANCE").length;
    const retired = vehicles.filter((v) => v.status === "RETIRED").length;
    return { active, maint, retired };
  }, [vehicles]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatPill label="Total vehicles" value={vehicles.length.toLocaleString()} />
      <StatPill label="Active" value={counts.active.toLocaleString()} />
      <StatPill label="Maintenance" value={counts.maint.toLocaleString()} />
      <StatPill label="Retired" value={counts.retired.toLocaleString()} />
    </div>
  );
}
