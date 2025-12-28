import type { MaintenanceStatus } from "../../../types/maintenance";

export default function StatusBadge({ status }: { status: MaintenanceStatus }) {
  const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1";
  switch (status) {
    case "COMPLETED":
      return <span className={`${base} bg-emerald-50 text-emerald-800 ring-emerald-200`}>Completed</span>;
    case "IN_PROGRESS":
      return <span className={`${base} bg-blue-50 text-blue-800 ring-blue-200`}>In progress</span>;
    case "OVERDUE":
      return <span className={`${base} bg-rose-50 text-rose-800 ring-rose-200`}>Overdue</span>;
    default:
      return <span className={`${base} bg-amber-50 text-amber-900 ring-amber-200`}>Scheduled</span>;
  }
}
