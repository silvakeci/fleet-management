import { Card } from "../../../components/ui";
import type { DashboardData } from "../dashboardSelectors";
import ActivityRow from "./ActivityRow";
import SectionTitle from "./SectionTitle";

export default function RecentActivity({
  data,
  onOpenVehicle,
}: {
  data: DashboardData;
  onOpenVehicle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="p-6 space-y-3">
        <SectionTitle
          title="Last Vehicles Added"
          right={<span className="text-xs text-slate-500">Top 5</span>}
        />
        <div className="space-y-2">
          {data.lastAdded.length === 0 ? (
            <div className="text-sm text-slate-500">No vehicles found.</div>
          ) : (
            data.lastAdded.map((v) => (
              <ActivityRow
                key={v.id}
                primary={`${v.make} ${v.model}`}
                secondary={`ID ${v.id} · Year ${v.year}`}
                right={v.status}
                onClick={() => onOpenVehicle(v.id)}
              />
            ))
          )}
        </div>
      </Card>

      {/* Recent maintenance completed */}
      <Card className="p-6 space-y-3">
        <SectionTitle
          title="Recent Maintenance Completed"
          right={<span className="text-xs text-slate-500">Latest 5</span>}
        />
        <div className="space-y-2">
          {data.recentMaintenance.length === 0 ? (
            <div className="text-sm text-slate-500">No completed maintenance records.</div>
          ) : (
            data.recentMaintenance.map((r) => (
              <ActivityRow
                key={r.id}
                primary={`${r.make} ${r.model} · ${r.vehicleId}`}
                secondary={`${r.date} · ${r.serviceType} · ${r.mileageAtService.toLocaleString()} km`}
                right={`€ ${r.cost.toLocaleString()}`}
                onClick={() => onOpenVehicle(r.vehicleId)}
              />
            ))
          )}
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <SectionTitle
          title="Recent Assignments"
          right={<span className="text-xs text-slate-500">Latest 5</span>}
        />
        <div className="space-y-2">
          {data.recentAssignments.length === 0 ? (
            <div className="text-sm text-slate-500">No assignments yet.</div>
          ) : (
            data.recentAssignments.map((a) => (
              <ActivityRow
                key={a.id}
                primary={a.driverName}
                secondary={`${a.make} ${a.model} · ${a.vehicleId} · ${a.from} → ${a.to ?? "Present"}`}
                onClick={() => onOpenVehicle(a.vehicleId)}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
