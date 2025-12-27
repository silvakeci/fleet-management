import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import { Card } from "../components/ui";

import { computeDashboardData } from "../features/dashboard/dashboardSelectors";
import SummaryCards from "../features/dashboard/components/SummaryCards";
import QuickStats from "../features/dashboard/components/QuickStats";
import RecentActivity from "../features/dashboard/components/RecentActivity";
import AlertsPanel from "../features/dashboard/components/AlertsPanel";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, status } = useAppSelector((s) => s.vehicles);

  useEffect(() => {
    if (status === "idle") dispatch(fetchVehicles());
  }, [dispatch, status]);

  const data = useMemo(() => computeDashboardData(items), [items]);

  if (status === "loading" || status === "idle") {
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
