import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageHeader from "../components/PageHeader";
import { Button, Card, Select } from "../components/ui";

import {
  fetchDrivers,
  assignVehicleLocal,
  unassignVehicleLocal,
  saveAssignment,
  clearAssignState,
} from "../features/drivers/driversSlice";

import { fetchVehicles, setVehicleAssignedDriver } from "../features/vehicles/vehiclesSlice";

export default function VehicleAssignmentPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const role = useAppSelector((s) => s.auth.user?.role);
  const canAssign = role === "ADMIN" || role === "FLEET_MANAGER";

  const [searchParams] = useSearchParams();
  const preselectedDriverId = searchParams.get("driverId") ?? "";

  const driversState = useAppSelector((s) => s.drivers);
  const vehiclesState = useAppSelector((s) => s.vehicles);

  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [vehicleId, setVehicleId] = useState<string>("");


  useEffect(() => {
    if (!canAssign) navigate("/drivers", { replace: true });
  }, [canAssign, navigate]);


  useEffect(() => {
    if (vehiclesState.status === "idle") dispatch(fetchVehicles());
  }, [dispatch, vehiclesState.status]);

  useEffect(() => {
    if (driversState.status === "idle") dispatch(fetchDrivers());
  }, [dispatch, driversState.status]);


  useEffect(() => {
    if (!preselectedDriverId) return;
    if (driversState.items.some((d) => d.id === preselectedDriverId)) {
      setSelectedDriverId(preselectedDriverId);
    }
  }, [preselectedDriverId, driversState.items]);


  const vehicleToDriver = useMemo(() => {
    const map: Record<string, string> = {};
    for (const d of driversState.items) {
      const current = d.assignedVehicleIds?.[0];
      if (current) map[current] = d.id;
    }
    return map;
  }, [driversState.items]);

  const selectedDriver = useMemo(
    () => driversState.items.find((d) => d.id === selectedDriverId),
    [driversState.items, selectedDriverId]
  );

  const selectedVehicle = useMemo(
    () => vehiclesState.items.find((v) => v.id === vehicleId),
    [vehiclesState.items, vehicleId]
  );

  const vehicleLabel = useMemo(() => {
    if (!vehicleId) return "";
    if (!selectedVehicle) return vehicleId;
    return `${selectedVehicle.make} ${selectedVehicle.model} · ${selectedVehicle.id}`;
  }, [vehicleId, selectedVehicle]);

  const currentOwnerId = vehicleId ? vehicleToDriver[vehicleId] : undefined;
  const currentOwner = currentOwnerId
    ? driversState.items.find((d) => d.id === currentOwnerId)
    : undefined;

  const canSubmit = Boolean(selectedDriverId && vehicleId);

  const conflict = Boolean(currentOwnerId && currentOwnerId !== selectedDriverId);

  const currentVehicleForDriver = selectedDriver?.assignedVehicleIds?.[0];

  useEffect(() => {
    if (driversState.assignStatus === "saved") {
      if (driversState.lastAssignAction === "ASSIGN") {
        alert("Assignment saved ✅");
      }
      dispatch(clearAssignState());
    }
  }, [driversState.assignStatus, driversState.lastAssignAction, dispatch]);
  

  const onAssign = () => {
    if (!canSubmit || !selectedDriver) return;

    if (conflict) {
      alert(`Conflict: vehicle already assigned to ${currentOwner?.name ?? currentOwnerId}`);
      return;
    }

    if (currentVehicleForDriver && currentVehicleForDriver !== vehicleId) {
      dispatch(
        unassignVehicleLocal({
          driverId: selectedDriverId,
          vehicleId: currentVehicleForDriver,
        })
      );

      dispatch(
        setVehicleAssignedDriver({
          vehicleId: currentVehicleForDriver,
          assignedDriverId: undefined,
          assignedDriverName: undefined,
        })
      );

      dispatch(
        saveAssignment({
          driverId: selectedDriverId,
          vehicleId: currentVehicleForDriver,
          action: "UNASSIGN",
        })
      );
    }

    dispatch(
      assignVehicleLocal({
        driverId: selectedDriverId,
        vehicleId,
        vehicleLabel,
      })
    );

    dispatch(
      setVehicleAssignedDriver({
        vehicleId,
        assignedDriverId: selectedDriver.id,
        assignedDriverName: selectedDriver.name,
      })
    );

    dispatch(saveAssignment({ driverId: selectedDriverId, vehicleId, action: "ASSIGN" }));
  };

  const onUnassign = () => {
    if (!canSubmit || !selectedDriver) return;

    dispatch(unassignVehicleLocal({ driverId: selectedDriverId, vehicleId }));

    dispatch(
      setVehicleAssignedDriver({
        vehicleId,
        assignedDriverId: undefined,
        assignedDriverName: undefined,
      })
    );

    dispatch(saveAssignment({ driverId: selectedDriverId, vehicleId, action: "UNASSIGN" }));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vehicle Assignment"
        subtitle="Assign/unassign vehicles to drivers. Only Admin and Fleet Managers can do this."
        right={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
      />

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Driver" value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)}>
            <option value="">Select driver…</option>
            {driversState.items.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.id})
              </option>
            ))}
          </Select>

          <Select label="Vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">Select vehicle…</option>
            {vehiclesState.items.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} — {v.make} {v.model} ({v.status})
              </option>
            ))}
          </Select>
        </div>

        {vehicleId && (
          <div className={`rounded-xl border p-4 ${conflict ? "bg-rose-50 border-rose-200" : "bg-slate-50"}`}>
            <div className="font-semibold">{vehicleLabel}</div>

            <div className="text-sm text-slate-600 mt-1">
              Current assignment:{" "}
              <span className="font-medium">
                {currentOwner ? `${currentOwner.name} (${currentOwner.id})` : "Unassigned"}
              </span>
            </div>

            {selectedDriver && selectedDriver.assignedVehicleIds.length > 0 && (
              <div className="text-sm text-slate-600 mt-2">
                Driver currently has:{" "}
                <span className="font-medium">{selectedDriver.assignedVehicleIds[0]}</span>
                {selectedDriver.assignedVehicleIds[0] !== vehicleId ? (
                  <span className="text-slate-500"> (will be unassigned automatically)</span>
                ) : null}
              </div>
            )}

            {conflict ? (
              <div className="text-sm text-rose-700 mt-1">
                Conflict: This vehicle is assigned to another driver. Unassign first or choose a different vehicle.
              </div>
            ) : null}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            disabled={!canSubmit || conflict || driversState.assignStatus === "saving"}
            loading={driversState.assignStatus === "saving"}
            onClick={onAssign}
          >
            Assign
          </Button>

          <Button
            variant="secondary"
            disabled={!canSubmit || driversState.assignStatus === "saving"}
            onClick={onUnassign}
          >
            Unassign
          </Button>
        </div>
      </Card>

      {selectedDriver && (
        <Card className="p-6 space-y-2">
          <div className="text-lg font-semibold">Current vehicle for {selectedDriver.name}</div>

          {selectedDriver.assignedVehicleIds.length === 0 ? (
            <div className="text-sm text-slate-500">No assigned vehicle.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedDriver.assignedVehicleIds.map((vid) => (
                <span
                  key={vid}
                  className="px-3 py-1 rounded-full bg-slate-100 ring-1 ring-slate-200 text-sm"
                >
                  {vid}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
