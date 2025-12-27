import { Card } from "../../../components/ui";
import type { DashboardData } from "../dashboardSelectors";
import SectionTitle from "./SectionTitle";

export default function QuickStats({ data }: { data: DashboardData }) {
  return (
    <Card className="p-6 space-y-4">
      <SectionTitle title="Quick Stats" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4 bg-white">
          <div className="text-xs text-slate-500">Total Fleet Mileage</div>
          <div className="text-2xl font-semibold mt-1">{data.totalMileage.toLocaleString()} km</div>
        </div>
        <div className="rounded-xl border p-4 bg-white">
          <div className="text-xs text-slate-500">Average Vehicle Age</div>
          <div className="text-2xl font-semibold mt-1">{data.avgAge} years</div>
        </div>
        <div className="rounded-xl border p-4 bg-white">
          <div className="text-xs text-slate-500">Monthly Maintenance Cost</div>
          <div className="text-2xl font-semibold mt-1">€ {data.monthlyMaintenanceCost.toLocaleString()}</div>
        </div>
      </div>
    </Card>
  );
}
