import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button, Card } from "../components/ui";
import DriverStatusBadge from "../features/drivers/components/DriverStatusBadge";
import { fetchDrivers } from "../features/drivers/driversSlice";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import type { DriverMetrics, DriverAssignmentHistoryItem } from "../types/driver";

function mockMetrics(driverId: string): DriverMetrics {
    const seed = Number(driverId.replace(/\D/g, "")) || 7;
    return {
        avgFuelEfficiency: 7.5 + (seed % 30) / 10,
        maintenanceIncidents: seed % 6,
        utilizationScore: 60 + (seed % 40),
    };
}

export default function DriverDetailsPage() {
    const { driverId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const drivers = useAppSelector((s) => s.drivers);
    const vehiclesState = useAppSelector((s) => s.vehicles);
    const role = useAppSelector((s) => s.auth.user?.role);
    const noAssigne= role ===  "DRIVER";
    useEffect(() => {
        if (vehiclesState.status === "idle") dispatch(fetchVehicles());
    }, [dispatch, vehiclesState.status]);

    useEffect(() => {
        if (drivers.status === "idle") dispatch(fetchDrivers());
    }, [dispatch, drivers.status]);

    const driver = useMemo(
        () => drivers.items.find((d) => d.id === driverId),
        [drivers.items, driverId]
    );

    const vehiclesById = useMemo(() => {
        const map: Record<string, any> = {};
        for (const v of vehiclesState.items) map[v.id] = v;
        return map;
    }, [vehiclesState.items]);

    const assignedVehicles = useMemo(() => {
        if (!driver) return [];
        return driver.assignedVehicleIds
            .map((id) => vehiclesById[id])
            .filter(Boolean);
    }, [driver, vehiclesById]);

    const history = useMemo<DriverAssignmentHistoryItem[]>(() => {
        if (!driver) return [];
        return driver.assignedVehicleIds.map((vid, idx) => {
            const v = vehiclesById[vid];
            const from = v?.lastServiceDate ?? "2025-01-01";
            return {
                id: `${driver.id}-${vid}-${idx}`,
                vehicleId: vid,
                vehicleLabel: v ? `${v.make} ${v.model} · ${vid}` : vid,
                from,
                to: undefined,
            };
        });
    }, [driver, vehiclesById]);

    const metrics = useMemo(() => (driver ? mockMetrics(driver.id) : null), [driver]);

    if (drivers.status === "loading" || vehiclesState.status === "loading") {
        return <Card className="p-6">Loading…</Card>;
    }

    if (!driver) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Driver not found</h1>
                    <Button variant="secondary" onClick={() => navigate("/drivers")}>Back</Button>
                </div>
                <Card className="p-10 text-center">
                    <div className="text-lg font-semibold">404 — Driver not found</div>
                    <div className="text-sm text-slate-500 mt-1">The driver ID in the URL does not exist.</div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">{driver.name}</h1>
                        <DriverStatusBadge status={driver.status} />
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{driver.id} · {driver.email}</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => navigate("/drivers")}>Back</Button>
                    {!noAssigne && (
                          <Button onClick={() => navigate(`/assignments?driverId=${driver.id}`)}>
                        Assign Vehicle
                    </Button>
                    )}
                  

                </div>
            </div>

            <Card className="p-6 space-y-3">
                <div className="text-lg font-semibold">Basic Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                        <div className="text-slate-500">License #</div>
                        <div className="font-medium">{driver.licenseNumber}</div>
                    </div>
                    <div>
                        <div className="text-slate-500">Phone</div>
                        <div className="font-medium">{driver.phone}</div>
                    </div>
                    <div>
                        <div className="text-slate-500">Email</div>
                        <div className="font-medium">{driver.email}</div>
                    </div>
                    <div>
                        <div className="text-slate-500">Status</div>
                        <div className="font-medium">{driver.status}</div>
                    </div>
                </div>
            </Card>

            <Card className="p-6 space-y-3">
                <div className="text-lg font-semibold">Assigned Vehicles</div>

                {assignedVehicles.length === 0 ? (
                    <div className="text-sm text-slate-500">No vehicles assigned.</div>
                ) : (
                    <div className="space-y-2">
                        {assignedVehicles.map((v: any) => (
                            <div
                                key={v.id}
                                className="rounded-xl border p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                                onClick={() => navigate(`/vehicles/${v.id}`)}
                                role="button"
                            >
                                <div>
                                    <div className="font-semibold">{v.make} {v.model} · {v.id}</div>
                                    <div className="text-sm text-slate-500">VIN {v.vin} · Year {v.year}</div>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 ring-1 ring-slate-200">
                                    {v.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <Card className="p-6 space-y-3">
                <div className="text-lg font-semibold">Assignment History</div>
                {history.length === 0 ? (
                    <div className="text-sm text-slate-500">No assignment history.</div>
                ) : (
                    <div className="space-y-2">
                        {history.map((h) => (
                            <div key={h.id} className="rounded-xl border p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-semibold">{h.vehicleLabel}</div>
                                    <div className="text-sm text-slate-500">{h.from} → {h.to ?? "Present"}</div>
                                </div>
                                {!h.to ? (
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                                        Current
                                    </span>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {metrics && (
                <Card className="p-6 space-y-3">
                    <div className="text-lg font-semibold">Performance Metrics (Mock)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl border p-4">
                            <div className="text-xs text-slate-500">Avg Fuel Efficiency</div>
                            <div className="text-2xl font-semibold mt-1">{metrics.avgFuelEfficiency.toFixed(1)} L/100km</div>
                        </div>
                        <div className="rounded-xl border p-4">
                            <div className="text-xs text-slate-500">Maintenance Incidents</div>
                            <div className="text-2xl font-semibold mt-1">{metrics.maintenanceIncidents}</div>
                        </div>
                        <div className="rounded-xl border p-4">
                            <div className="text-xs text-slate-500">Utilization Score</div>
                            <div className="text-2xl font-semibold mt-1">{metrics.utilizationScore}</div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
