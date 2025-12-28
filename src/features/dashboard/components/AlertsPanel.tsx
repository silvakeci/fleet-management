import { Card } from "../../../components/ui";
import type { DashboardData } from "../dashboardSelectors";
import SectionTitle from "./SectionTitle";

export default function AlertsPanel({
  data,
  onGoVehicles,
}: {
  data: DashboardData;
  onGoVehicles: (to: string) => void;
}) {
  return (
    <Card className="p-6 space-y-4">
      <SectionTitle title="Alerts & Notifications" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 🔴 Overdue Maintenance */}
        <Card
          className="p-5 bg-rose-50 border-rose-200 cursor-pointer hover:shadow-sm"
          onClick={() => onGoVehicles("/vehicles?service=overdue")}
          role="button"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-rose-800 font-semibold">
                Overdue Maintenance
              </div>
              <div className="text-2xl font-semibold mt-1 text-rose-900">
                {data.overdueMaintenance.toLocaleString()}
              </div>
              <div className="text-xs text-rose-700 mt-1">
                Requires immediate attention
              </div>
            </div>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 ring-1 ring-rose-200">
              High
            </span>
          </div>
        </Card>

        {/* 🟡 Service Due Soon */}
        <Card
          className="p-5 bg-amber-50 border-amber-200 cursor-pointer hover:shadow-sm"
          onClick={() => onGoVehicles("/vehicles?service=dueSoon")}
          role="button"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-amber-900 font-semibold">
                Service Due Soon
              </div>
              <div className="text-2xl font-semibold mt-1 text-amber-950">
                {data.vehiclesServiceSoon.toLocaleString()}
              </div>
              <div className="text-xs text-amber-800 mt-1">
                Due within 30 days
              </div>
            </div>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-950 ring-1 ring-amber-200">
              Medium
            </span>
          </div>
        </Card>
      </div>
    </Card>
  );
}
