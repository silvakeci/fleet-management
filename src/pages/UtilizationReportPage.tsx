import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageHeader from "../components/PageHeader";
import { Button, Card } from "../components/ui";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import StatCard from "../features/reports/components/StatCard";
import BarList from "../features/reports/components/BarList";
import { daysBetween, todayISO, vehicleLabel } from "../features/reports/reportUtils";

export default function UtilizationReportPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const vehiclesState = useAppSelector((s) => s.vehicles);

  useEffect(() => {
    if (vehiclesState.status === "idle") dispatch(fetchVehicles());
  }, [dispatch, vehiclesState.status]);

  const vehicles = vehiclesState.items;
  const today = todayISO();

  const avgMileage = useMemo(() => {
    if (vehicles.length === 0) return 0;
    const sum = vehicles.reduce((acc, v) => acc + (v.currentMileage ?? 0), 0);
    return sum / vehicles.length;
  }, [vehicles]);

  const sortedByMileage = useMemo(() => {
    return [...vehicles].sort((a, b) => (b.currentMileage ?? 0) - (a.currentMileage ?? 0));
  }, [vehicles]);

  const mostUsed = sortedByMileage.slice(0, 10).map((v) => ({
    key: vehicleLabel(v),
    value: v.currentMileage,
  }));

  const leastUsed = [...sortedByMileage].reverse().slice(0, 10).map((v) => ({
    key: vehicleLabel(v),
    value: v.currentMileage,
  }));

  const idleOver30 = useMemo(() => {
    return vehicles
      .filter((v) => v.lastServiceDate && daysBetween(v.lastServiceDate, today) > 30)
      .sort((a, b) => daysBetween(b.lastServiceDate, today) - daysBetween(a.lastServiceDate, today));
  }, [vehicles, today]);

  const idleList = idleOver30.slice(0, 12).map((v) => ({
    key: `${vehicleLabel(v)} (idle ${daysBetween(v.lastServiceDate, today)}d)`,
    value: daysBetween(v.lastServiceDate, today),
  }));

  if (vehiclesState.status === "loading" || vehiclesState.status === "idle") {
    return <Card className="p-6">Loading report…</Card>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports • Utilization"
        subtitle="Mileage-based usage, most/least used vehicles, and idle vehicles."
        right={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => dispatch(fetchVehicles())}>Refresh</Button>
            <Button variant="secondary" onClick={() => navigate("/reports")}>Fleet Overview</Button>
            <Button onClick={() => navigate("/reports/costs")}>Cost Analysis</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Vehicles" value={vehicles.length.toLocaleString()} />
        <StatCard label="Avg mileage / vehicle" value={`${Math.round(avgMileage).toLocaleString()} km`} />
        <StatCard label="Idle > 30 days" value={idleOver30.length.toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarList title="Most used (top 10 mileage)" items={mostUsed} valueFormatter={(n) => `${n.toLocaleString()} km`} />
        <BarList title="Least used (bottom 10 mileage)" items={leastUsed} valueFormatter={(n) => `${n.toLocaleString()} km`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarList title="Vehicles idle > 30 days (by last service date)" items={idleList} valueFormatter={(n) => `${n} days`} />
        <Card className="p-6">
          <div className="text-sm font-semibold">Interpretation</div>
          <div className="mt-2 text-sm text-slate-600">
            Idle is estimated from <span className="font-medium">Last Service Date</span> due to mock data.
            If you later add telemetry or trip logs, we’ll switch this to a real “last used” signal.
          </div>
        </Card>
      </div>
    </div>
  );
}
