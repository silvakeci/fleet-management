import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageHeader from "../components/PageHeader";
import { Button, Card, Input, Select } from "../components/ui";

import type { MaintenanceRecord, MaintenanceServiceType } from "../types/maintenance";
import { createMaintenance, clearCreateState } from "../features/maintenance/maintenanceSlice";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function validate({
  vehicleId,
  date,
  serviceType,
  cost,
  mileageAtService,
  technician,
  vehicleMileage,
}: {
  vehicleId: string;
  date: string;
  serviceType: MaintenanceServiceType | "";
  cost: string;
  mileageAtService: string;
  technician: string;
  vehicleMileage: number | null;
}) {
  const errors: Record<string, string> = {};

  if (!vehicleId) errors.vehicleId = "Vehicle is required";
  if (!date) errors.date = "Date is required";
  if (!serviceType) errors.serviceType = "Service type is required";
  if (!cost) errors.cost = "Cost is required";
  if (!mileageAtService) errors.mileageAtService = "Mileage is required";
  if (!technician.trim()) errors.technician = "Technician is required";

  if (date && date > todayISO()) errors.date = "Date cannot be in the future";

  const c = Number(cost);
  if (Number.isNaN(c) || c < 0) errors.cost = "Cost must be a valid number (>= 0)";

  const m = Number(mileageAtService);
  if (Number.isNaN(m) || m <= 0) errors.mileageAtService = "Mileage must be a positive number";

  if (vehicleMileage !== null && !Number.isNaN(m) && m < vehicleMileage) {
    errors.mileageAtService = `Mileage at service must be ≥ current vehicle mileage (${vehicleMileage.toLocaleString()} km)`;
  }

  return errors;
}

export default function MaintenanceCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const role = useAppSelector((s) => s.auth.user?.role);
  const canCreate = role === "ADMIN" || role === "FLEET_MANAGER";

  useEffect(() => {
    if (!canCreate) navigate("/maintenance", { replace: true });
  }, [canCreate, navigate]);

  const vehiclesState = useAppSelector((s) => s.vehicles);
  const maintState = useAppSelector((s) => s.maintenance);

  useEffect(() => {
    if (vehiclesState.status === "idle") dispatch(fetchVehicles());
  }, [dispatch, vehiclesState.status]);

  const [vehicleId, setVehicleId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [serviceType, setServiceType] = useState<MaintenanceServiceType | "">("");
  const [cost, setCost] = useState("");
  const [mileageAtService, setMileageAtService] = useState("");
  const [technician, setTechnician] = useState("");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const vehicle = useMemo(
    () => vehiclesState.items.find((v) => v.id === vehicleId),
    [vehiclesState.items, vehicleId]
  );

  const errors = useMemo(
    () =>
      validate({
        vehicleId,
        date,
        serviceType,
        cost,
        mileageAtService,
        technician,
        vehicleMileage: vehicle ? vehicle.currentMileage : null,
      }),
    [vehicleId, date, serviceType, cost, mileageAtService, technician, vehicle]
  );

  const isValid = Object.keys(errors).length === 0;
  const showError = (k: string): string | undefined => (touched[k] ? errors[k] : undefined);

  useEffect(() => {
    if (maintState.createStatus === "saved") {
      dispatch(clearCreateState());
      alert("Maintenance record saved ✅");
      navigate("/maintenance/log");
    }
  }, [maintState.createStatus, dispatch, navigate]);

  const onSubmit = () => {
    setTouched({
      vehicleId: true,
      date: true,
      serviceType: true,
      cost: true,
      mileageAtService: true,
      technician: true,
    });

    if (!isValid) return;

    const record: MaintenanceRecord = {
      id: `M-${Date.now()}`,
      vehicleId,
      scheduledDate: date,
      completedDate: date, 
      serviceType: serviceType as MaintenanceServiceType,
      status: "COMPLETED",
      cost: Number(cost),
      mileageAtService: Number(mileageAtService),
      technician: technician.trim(),
      notes: notes.trim() ? notes.trim() : undefined,
    };

    dispatch(createMaintenance(record));
  };


  return (
    <div className="space-y-5">
      <PageHeader
        title="Log Maintenance"
        subtitle="Create a maintenance record and sync it into the vehicle’s history."
        right={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              disabled={!isValid || maintState.createStatus === "saving"}
              loading={maintState.createStatus === "saving"}
              onClick={onSubmit}
            >
              Save
            </Button>
          </div>
        }
      />

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Vehicle *"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, vehicleId: true }))}
            error={showError("vehicleId")}
          >
            <option value="">Select vehicle…</option>
            {vehiclesState.items.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} — {v.make} {v.model} ({v.status})
              </option>
            ))}
          </Select>

          <Input
            label="Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, date: true }))}
            error={showError("date")}
          />

          <Select
            label="Service Type *"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as MaintenanceServiceType | "")}
            onBlur={() => setTouched((t) => ({ ...t, serviceType: true }))}
            error={showError("serviceType")}
          >
            <option value="">Select service…</option>
            <option value="OIL_CHANGE">Oil Change</option>
            <option value="TIRE_ROTATION">Tire Rotation</option>
            <option value="INSPECTION">Inspection</option>
            <option value="REPAIR">Repair</option>
          </Select>

          <Input
            label="Cost (€) *"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, cost: true }))}
            error={showError("cost")}
            min={0}
          />

          <Input
            label="Mileage at Service (km) *"
            type="number"
            value={mileageAtService}
            onChange={(e) => setMileageAtService(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, mileageAtService: true }))}
            error={showError("mileageAtService")}
            min={1}
          />

          <Input
            label="Technician *"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, technician: true }))}
            error={showError("technician")}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-black focus:border-black"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {vehicle ? (
          <div className="text-xs text-slate-500">
            Current vehicle mileage:{" "}
            <span className="font-semibold text-slate-800">
              {vehicle.currentMileage.toLocaleString()} km
            </span>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
