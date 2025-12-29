import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageHeader from "../components/PageHeader";
import { Button, Card, Input } from "../components/ui";
import { fetchDrivers } from "../features/drivers/driversSlice";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import type { DriverStatus } from "../types/driver";

const DriversTable = lazy(() => import("../features/drivers/components/DriversTable"));

export default function DriversPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const role = useAppSelector((s) => s.auth.user?.role);
  const noAssigne = role === "DRIVER";
  const drivers = useAppSelector((s) => s.drivers);
  const vehiclesState = useAppSelector((s) => s.vehicles);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "ALL">("ALL");

  useEffect(() => {
    if (vehiclesState.status === "idle") dispatch(fetchVehicles());
  }, [dispatch, vehiclesState.status]);

  useEffect(() => {
    if (drivers.status === "idle") dispatch(fetchDrivers());
  }, [dispatch, drivers.status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return drivers.items.filter((d) => {
      const matchesSearch = !q || d.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers.items, search, statusFilter]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Drivers"
        subtitle="Search drivers, view details, and manage assignments."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-72">
              <Input
                placeholder="Search by driver name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="h-10 rounded-lg border px-3 text-sm bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>

            <Button
              variant="secondary"
              loading={drivers.status === "loading"}
              onClick={() => dispatch(fetchDrivers())}
            >
              Refresh
            </Button>
            {!noAssigne && (
              <Button onClick={() => navigate("/assignments")}>
                Assign Vehicles
              </Button>
            )
            }

          </div>
        }
      />

      {drivers.status === "loading" && <Card className="p-6">Loading drivers…</Card>}

      {drivers.status === "failed" && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="font-semibold text-red-800">Error loading drivers</div>
          <div className="text-sm text-red-700 mt-1">{drivers.error}</div>
        </Card>
      )}

      {drivers.status === "succeeded" && drivers.items.length === 0 && (
        <Card className="p-10 text-center">
          <div className="text-lg font-semibold">No drivers available</div>
          <div className="text-sm text-slate-500 mt-1">Mock data will appear after load.</div>
        </Card>
      )}

      {drivers.status === "succeeded" && drivers.items.length > 0 && filtered.length === 0 && (
        <Card className="p-10 text-center">
          <div className="text-lg font-semibold">No results</div>
          <div className="text-sm text-slate-500 mt-1">Try changing search/filter.</div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => { setSearch(""); setStatusFilter("ALL"); }}>
              Clear filters
            </Button>
          </div>
        </Card>
      )}

      {drivers.status === "succeeded" && filtered.length > 0 && (
        <Suspense fallback={<Card className="p-6">Loading table…</Card>}>
          <DriversTable drivers={filtered} onRowClick={(id) => navigate(`/drivers/${id}`)} />
        </Suspense>
      )}
    </div>
  );
}
