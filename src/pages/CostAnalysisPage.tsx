import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageHeader from "../components/PageHeader";
import { Button, Card } from "../components/ui";
import { fetchMaintenance } from "../features/maintenance/maintenanceSlice";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import StatCard from "../features/reports/components/StatCard";
import BarList from "../features/reports/components/BarList";
import {
  maintenanceCompleted,
  monthKey,
  serviceLabel,
  vehicleLabel,
} from "../features/reports/reportUtils";

export default function CostAnalysisPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const maintState = useAppSelector((s) => s.maintenance);
  const vehiclesState = useAppSelector((s) => s.vehicles);

  useEffect(() => {
    if (vehiclesState.status === "idle") dispatch(fetchVehicles());
  }, [dispatch, vehiclesState.status]);

  useEffect(() => {
    if (maintState.status === "idle") dispatch(fetchMaintenance());
  }, [dispatch, maintState.status]);

  const vehiclesById = useMemo(() => {
    const map: Record<string, any> = {};
    for (const v of vehiclesState.items) map[v.id] = v;
    return map;
  }, [vehiclesState.items]);

  const completed = useMemo(() => maintenanceCompleted(maintState.items), [maintState.items]);

  const totalCost = useMemo(() => {
    return completed.reduce((acc, r) => acc + (r.cost ?? 0), 0);
  }, [completed]);

  const byMonth = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of completed) {
      const d = r.completedDate ?? r.scheduledDate;
      const key = monthKey(d);
      m.set(key, (m.get(key) ?? 0) + (r.cost ?? 0));
    }
    return Array.from(m.entries())
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => a.key.localeCompare(b.key)); 
  }, [completed]);

  const byVehicle = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of completed) {
      m.set(r.vehicleId, (m.get(r.vehicleId) ?? 0) + (r.cost ?? 0));
    }
    return Array.from(m.entries())
      .map(([vid, value]) => ({
        key: vehiclesById[vid] ? vehicleLabel(vehiclesById[vid]) : vid,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [completed, vehiclesById]);

  const byServiceType = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of completed) {
      const key = serviceLabel(r.serviceType);
      m.set(key, (m.get(key) ?? 0) + (r.cost ?? 0));
    }
    return Array.from(m.entries())
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }, [completed]);

  const top10Expensive = byVehicle.slice(0, 10);

  if (maintState.status === "loading" || maintState.status === "idle") {
    return <Card className="p-6">Loading report…</Card>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports • Cost Analysis"
        subtitle="Maintenance spend over time, per vehicle, and by service type."
        right={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => dispatch(fetchMaintenance())}>Refresh</Button>
            <Button variant="secondary" onClick={() => navigate("/reports")}>Fleet Overview</Button>
            <Button onClick={() => navigate("/reports/utilization")}>Utilization</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Completed maintenance records" value={completed.length.toLocaleString()} />
        <StatCard label="Total maintenance cost" value={`€ ${Math.round(totalCost).toLocaleString()}`} />
        <StatCard label="Avg cost / record" value={`€ ${Math.round(completed.length ? totalCost / completed.length : 0).toLocaleString()}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarList title="Total maintenance cost by month" items={byMonth} valueFormatter={(n) => `€ ${Math.round(n).toLocaleString()}`} />
        <BarList title="Cost breakdown by service type" items={byServiceType} valueFormatter={(n) => `€ ${Math.round(n).toLocaleString()}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarList title="Top 10 most expensive vehicles to maintain" items={top10Expensive} valueFormatter={(n) => `€ ${Math.round(n).toLocaleString()}`} />
        <Card className="p-6">
          <div className="text-sm font-semibold">Cost per vehicle (notes)</div>
          <div className="mt-2 text-sm text-slate-600">
            Costs are aggregated from completed maintenance records. If you later add fuel logs,
            we can extend this report to include fuel spend and total cost of ownership.
          </div>
        </Card>
      </div>
    </div>
  );
}
