import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageHeader from "../components/PageHeader";
import { Button, Card } from "../components/ui";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import { fetchMaintenance } from "../features/maintenance/maintenanceSlice";

import StatCard from "../features/reports/components/StatCard";
import BarList from "../features/reports/components/BarList";
import {
  groupCount,
  mapToSortedArray,
  yearBucket,
} from "../features/reports/reportUtils";

export default function ReportsOverviewPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const vehiclesState = useAppSelector((s) => s.vehicles);
  const maintState = useAppSelector((s) => s.maintenance);

  useEffect(() => {
    if (vehiclesState.status === "idle") dispatch(fetchVehicles());
  }, [dispatch, vehiclesState.status]);

  useEffect(() => {
    if (maintState.status === "idle") dispatch(fetchMaintenance());
  }, [dispatch, maintState.status]);

  const items = vehiclesState.items;

  const nowYear = new Date().getFullYear();

  const statusCounts = useMemo(() => {
    const m = groupCount(items.map((v) => v.status));
    return mapToSortedArray(m);
  }, [items]);

  const makeCounts = useMemo(() => {
    const m = groupCount(items.map((v) => v.make));
    return mapToSortedArray(m);
  }, [items]);

  const modelCounts = useMemo(() => {
    const m = groupCount(items.map((v) => `${v.make} ${v.model}`));
    return mapToSortedArray(m);
  }, [items]);

  const ageBuckets = useMemo(() => {
    const ages = items.map((v) => Math.max(0, nowYear - v.year));
    const m = groupCount(ages.map(yearBucket));
    const order = ["0–1", "2–3", "4–5", "6–8", "9–12", "13+"];

    const arr = order.map((k) => ({ key: k, value: m.get(k as any) ?? 0 }));
    return arr;
  }, [items, nowYear]);

  const total = items.length;
  const active = items.filter((v) => v.status === "ACTIVE").length;
  const maint = items.filter((v) => v.status === "MAINTENANCE").length;
  const retired = items.filter((v) => v.status === "RETIRED").length;

  if (vehiclesState.status === "loading" || vehiclesState.status === "idle") {
    return <Card className="p-6">Loading report…</Card>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports • Fleet Overview"
        subtitle="High-level fleet composition, status distribution, and vehicle age."
        right={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => dispatch(fetchVehicles())}>
              Refresh
            </Button>
            <Button onClick={() => navigate("/reports/utilization")}>
              Utilization
            </Button>
            <Button onClick={() => navigate("/reports/costs")}>
              Cost Analysis
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total vehicles" value={total.toLocaleString()} />
        <StatCard label="Active" value={active.toLocaleString()} />
        <StatCard label="In maintenance" value={maint.toLocaleString()} />
        <StatCard label="Retired" value={retired.toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BarList title="Fleet composition by make" items={makeCounts} />
        <BarList title="Fleet composition by model" items={modelCounts} />
        <BarList title="Status distribution" items={statusCounts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarList title="Age distribution (years)" items={ageBuckets} />
        <Card className="p-6">
          <div className="text-sm font-semibold">Notes</div>
          <div className="mt-2 text-sm text-slate-600">
            • Age is calculated from the current year minus manufacturing year. <br />
            • Charts are lightweight and computed via memoized selectors for performance.
          </div>
        </Card>
      </div>
    </div>
  );
}
