import type { ServiceType } from "../../../../types/vehicleDetails";

export default function ServiceTypePill({ t }: { t: ServiceType }) {
  const base = "px-2.5 py-1 rounded-full text-xs font-medium ring-1";
  if (t === "OIL")
    return <span className={`${base} bg-slate-50 text-slate-700 ring-slate-200`}>Oil</span>;
  if (t === "TIRES")
    return <span className={`${base} bg-indigo-50 text-indigo-700 ring-indigo-100`}>Tires</span>;
  if (t === "INSPECTION")
    return <span className={`${base} bg-teal-50 text-teal-700 ring-teal-100`}>Inspection</span>;
  return <span className={`${base} bg-rose-50 text-rose-700 ring-rose-100`}>Repair</span>;
}
