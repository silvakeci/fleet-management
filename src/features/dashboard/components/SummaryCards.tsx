import type { DashboardData } from "../dashboardSelectors";
import MetricCard from "./MetricCard";

export default function SummaryCards({
  data,
  onGoVehicles,
}: {
  data: DashboardData;
  onGoVehicles: (to: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard title="Total Vehicles" value={data.total.toLocaleString()} subtitle="All fleet vehicles" onClick={() => onGoVehicles("/vehicles")} />
      <MetricCard title="Active" value={data.active.toLocaleString()} subtitle="Ready for operation" tone="green" onClick={() => onGoVehicles("/vehicles?status=ACTIVE")} />
      <MetricCard title="In Maintenance" value={data.maint.toLocaleString()} subtitle="Currently serviced" tone="yellow" onClick={() => onGoVehicles("/vehicles?status=MAINTENANCE")} />
      <MetricCard title="Retired" value={data.retired.toLocaleString()} subtitle="No longer in service" onClick={() => onGoVehicles("/vehicles?status=RETIRED")} />
      <MetricCard
        title="Service Due Soon"
        value={data.dueSoon.length.toLocaleString()}
        subtitle="Due in < 30 days"
        tone="blue"
        badge={data.overdue.length > 0 ? { label: `${data.overdue.length} overdue`, tone: "red" } : undefined}
        onClick={() => onGoVehicles("/vehicles?service=dueSoon")}
      />
    </div>
  );
}
