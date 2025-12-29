import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card } from "../components/ui";

import { bootstrapAppData } from "../app/appBootstrap";
import { computeDashboardData } from "../features/dashboard/dashboardSelectors";

import SummaryCards from "../features/dashboard/components/SummaryCards";
import QuickStats from "../features/dashboard/components/QuickStats";
import RecentActivity from "../features/dashboard/components/RecentActivity";
import AlertsPanel from "../features/dashboard/components/AlertsPanel";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const vehiclesState = useAppSelector((s) => s.vehicles);

  useEffect(() => {
    dispatch(bootstrapAppData());
  }, [dispatch]);

  const vehicles = useAppSelector((s) => s.vehicles.items);
const drivers = useAppSelector((s) => s.drivers.items);
const maintenance = useAppSelector((s) => s.maintenance.items);

const data = useMemo(
  () => computeDashboardData(vehicles, drivers, maintenance),
  [vehicles, drivers, maintenance]
);

  if (vehiclesState.status === "loading" || vehiclesState.status === "idle") {
    return (
      <div className="space-y-4">
        <div className="h-7 w-56 bg-slate-200 rounded animate-pulse" />
        <Card className="p-6">
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-24 bg-slate-200 rounded-xl" />
            <div className="h-24 bg-slate-200 rounded-xl" />
            <div className="h-24 bg-slate-200 rounded-xl" />
          </div>
        </Card>
      </div>
    );
  }

  if (vehiclesState.status === "failed") {
    return (
      <Card className="p-6 border-rose-200 bg-rose-50">
        <div className="font-semibold text-rose-900">Failed to load app data</div>
        <div className="text-sm text-rose-800 mt-1">{vehiclesState.error}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          High-level overview of vehicles, maintenance, and assignments.
        </p>
      </div>

      <SummaryCards data={data} onGoVehicles={(to) => navigate(to)} />
      <QuickStats data={data} />
      <RecentActivity data={data} onOpenVehicle={(id) => navigate(`/vehicles/${id}`)} />
      <AlertsPanel data={data} onGoVehicles={(to) => navigate(to)} />
    </div>
  );
}
