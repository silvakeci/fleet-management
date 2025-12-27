import type { VehicleStatus } from "../../types/vehicle";

const styles: Record<VehicleStatus, { label: string; cls: string; dot: string }> = {
  ACTIVE: {
    label: "Active",
    cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    dot: "bg-emerald-500",
  },
  MAINTENANCE: {
    label: "Maintenance",
    cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    dot: "bg-amber-500",
  },
  RETIRED: {
    label: "Retired",
    cls: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    dot: "bg-slate-500",
  },
};

export default function StatusBadge({ status }: { status: VehicleStatus }) {
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
