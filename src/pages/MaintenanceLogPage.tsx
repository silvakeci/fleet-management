import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMaintenance } from "../features/maintenance/maintenanceSlice";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import PageHeader from "../components/PageHeader";
import { Button, Card, Input, Select } from "../components/ui";
import type { MaintenanceServiceType } from "../types/maintenance";
import { toLogRows } from "../features/maintenance/utils/toLogRows";

const MaintenanceLogTable = lazy(
  () => import("../features/maintenance/components/MaintenanceLogTable")
);

export default function MaintenanceLogPage() {
  const dispatch = useAppDispatch();
  const maint = useAppSelector((s) => s.maintenance);
  const vehiclesState = useAppSelector((s) => s.vehicles);
  const [vehicleId, setVehicleId] = useState<string>("");
  const [serviceType, setServiceType] = useState<MaintenanceServiceType | "ALL">(
    "ALL"
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (vehiclesState.status === "idle") dispatch(fetchVehicles());
  }, [dispatch, vehiclesState.status]);

  useEffect(() => {
    if (maint.status === "idle") dispatch(fetchMaintenance());
  }, [dispatch, maint.status]);

  const vehiclesById = useMemo(() => {
    const map: Record<string, (typeof vehiclesState.items)[number]> = {};
    for (const v of vehiclesState.items) map[v.id] = v;
    return map;
  }, [vehiclesState.items]);

  const completed = useMemo(
    () => maint.items.filter((r) => r.status === "COMPLETED"),
    [maint.items]
  );

  const filtered = useMemo(() => {
    let data = completed;

    if (vehicleId) data = data.filter((r) => r.vehicleId === vehicleId);
    if (serviceType !== "ALL") data = data.filter((r) => r.serviceType === serviceType);

    const getDate = (r: typeof completed[number]) => r.completedDate ?? r.scheduledDate;

    if (fromDate) data = data.filter((r) => getDate(r) >= fromDate);
    if (toDate) data = data.filter((r) => getDate(r) <= toDate);

    return data.sort((a, b) => getDate(b).localeCompare(getDate(a)));
  }, [completed, vehicleId, serviceType, fromDate, toDate]);

  const rows = useMemo(() => toLogRows(filtered, vehiclesById), [filtered, vehiclesById]);

  const clearFilters = () => {
    setVehicleId("");
    setServiceType("ALL");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Maintenance Log"
        subtitle="Historical maintenance records. Search and filter by vehicle, date, and service type."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
              <option value="">All vehicles</option>
              {vehiclesState.items.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} — {v.make} {v.model}
                </option>
              ))}
            </Select>

            <select
              className="h-10 rounded-lg border px-3 text-sm bg-white"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as any)}
            >
              <option value="ALL">All types</option>
              <option value="OIL_CHANGE">Oil Change</option>
              <option value="TIRE_ROTATION">Tire Rotation</option>
              <option value="INSPECTION">Inspection</option>
              <option value="REPAIR">Repair</option>
            </select>

            <div className="w-40">
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="w-40">
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            <Button variant="secondary" onClick={clearFilters}>
              Clear
            </Button>

            <Button
              variant="secondary"
              loading={maint.status === "loading"}
              onClick={() => dispatch(fetchMaintenance())}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {maint.status === "loading" && <Card className="p-6">Loading records…</Card>}

      {maint.status === "failed" && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="font-semibold text-red-800">Error loading maintenance</div>
          <div className="text-sm text-red-700 mt-1">{maint.error}</div>
        </Card>
      )}

      {maint.status === "succeeded" && completed.length === 0 && (
        <Card className="p-10 text-center">
          <div className="text-lg font-semibold">No maintenance records</div>
          <div className="text-sm text-slate-500 mt-1">
            Completed maintenance will appear here.
          </div>
        </Card>
      )}

      {maint.status === "succeeded" && completed.length > 0 && filtered.length === 0 && (
        <Card className="p-10 text-center">
          <div className="text-lg font-semibold">No results</div>
          <div className="text-sm text-slate-500 mt-1">Try changing filters.</div>
        </Card>
      )}

      {maint.status === "succeeded" && filtered.length > 0 && (
        <Suspense fallback={<Card className="p-6">Loading table…</Card>}>
          <MaintenanceLogTable rows={rows} />
        </Suspense>
      )}
    </div>
  );
}
