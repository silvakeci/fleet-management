import type { DriverStatus } from "../../../types/driver";

export default function DriverStatusBadge({ status }: { status: DriverStatus }) {
  const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1";
  if (status === "ACTIVE") return <span className={`${base} bg-emerald-50 text-emerald-800 ring-emerald-200`}>Active</span>;
  if (status === "ON_LEAVE") return <span className={`${base} bg-amber-50 text-amber-900 ring-amber-200`}>On Leave</span>;
  return <span className={`${base} bg-slate-100 text-slate-700 ring-slate-200`}>Terminated</span>;
}
