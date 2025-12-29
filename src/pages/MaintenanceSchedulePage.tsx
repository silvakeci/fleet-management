import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMaintenance } from "../features/maintenance/maintenanceSlice";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import PageHeader from "../components/PageHeader";
import { Button, Card } from "../components/ui";
import MaintenanceFilters from "../features/maintenance/components/MaintenanceFilters";
import MaintenanceScheduleList from "../features/maintenance/components/MaintenanceScheduleList";
import { filterSchedule, sortSchedule, type ScheduleFilter } from "../features/maintenance/selectors";

export default function MaintenanceSchedulePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const maint = useAppSelector((s) => s.maintenance);
  const vehiclesState = useAppSelector((s) => s.vehicles);

  const [filter, setFilter] = useState<ScheduleFilter>("ALL");
  const [sortBy, setSortBy] = useState<"DATE" | "VEHICLE">("DATE");
  const role = useAppSelector((s) => s.auth.user?.role);
  const noLog = role === "DRIVER" || role === "FLEET_MANAGER";


  useEffect(() => {
    if (vehiclesState.status === "idle") dispatch(fetchVehicles());
  }, [dispatch, vehiclesState.status]);

  useEffect(() => {
    if (maint.status === "idle") dispatch(fetchMaintenance());
  }, [dispatch, maint.status]);

  const vehiclesById = useMemo(() => {
    const map: Record<string, any> = {};
    for (const v of vehiclesState.items) map[v.id] = v;
    return map;
  }, [vehiclesState.items]);

  const upcoming = useMemo(() => {
    const scheduled = maint.items.filter((r) => r.status !== "COMPLETED");
    const filtered = filterSchedule(scheduled, filter);
    return sortSchedule(filtered, sortBy);
  }, [maint.items, filter, sortBy]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Maintenance Schedule"
        subtitle="Upcoming maintenance tasks, overdue items, and work in progress."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <MaintenanceFilters
              filter={filter}
              sortBy={sortBy}
              onFilterChange={setFilter}
              onSortChange={setSortBy}
            />
            <Button
              variant="secondary"
              loading={maint.status === "loading"}
              onClick={() => dispatch(fetchMaintenance())}
            >
              Refresh
            </Button>
            {
              !noLog && (
                <Button onClick={() => navigate("/maintenance/new")}>Log Maintenance</Button>
              )
            }

          </div>
        }
      />

      {maint.status === "loading" && <Card className="p-6">Loading schedule…</Card>}

      {maint.status === "failed" && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="font-semibold text-red-800">Error loading maintenance</div>
          <div className="text-sm text-red-700 mt-1">{maint.error}</div>
        </Card>
      )}

      {maint.status === "succeeded" && (
        <MaintenanceScheduleList
          items={upcoming}
          vehiclesById={vehiclesById}
          onOpenVehicle={(id) => navigate(`/vehicles/${id}`)}
        />
      )}
    </div>
  );
}
