import type { DashboardData } from "../dashboardSelectors";
import { Card } from "../../../components/ui";

export default function RecentActivity({
  data,
  onOpenVehicle,
}: {
  data: DashboardData;
  onOpenVehicle: (id: string) => void;
}) {
    console.log('dad', data)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-6">
        <div className="text-sm font-semibold">Last 5 vehicles added</div>
        <div className="text-xs text-slate-500 mt-1">Most recently created vehicles</div>

        {data.last5VehiclesAdded.length === 0 ? (
          <div className="mt-4 text-sm text-slate-500">No vehicles yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {data.last5VehiclesAdded.map((v) => (
              <button
                key={v.id}
                className="w-full text-left rounded-xl border bg-white hover:bg-slate-50 px-4 py-3 transition"
                onClick={() => onOpenVehicle(v.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-sm">
                    {v.make} {v.model}
                  </div>
                  <div className="text-xs text-slate-500">{v.id}</div>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {v.status} · {v.year} · {v.currentMileage.toLocaleString()} km
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="text-sm font-semibold">Recent assignments</div>
        <div className="text-xs text-slate-500 mt-1">
          Last 5 driver assignments across the fleet
        </div>

        {data.recentAssignments.length === 0 ? (
          <div className="mt-4 text-sm text-slate-500">No assignment activity yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {data.recentAssignments.map((a) => (
              <button
                key={`${a.vehicleId}-${a.date}-${a.driverName}`}
                className="w-full text-left rounded-xl border bg-white hover:bg-slate-50 px-4 py-3 transition"
                onClick={() => onOpenVehicle(a.vehicleId)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-sm">{a.driverName}</div>
                  <div className="text-xs text-slate-500">{a.date}</div>
                </div>
                <div className="text-xs text-slate-600 mt-1">{a.vehicleLabel}</div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

