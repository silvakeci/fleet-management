import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Card } from "../components/ui";
import { saveVehicle, clearSaveState, fetchVehicles } from "../features/vehicles/vehiclesSlice";
import type { Mode } from "../features/vehicles/form/utils";

import VehicleFormHeader from "../features/vehicles/form/components/VehicleFormHeader";
import SaveErrorBanner from "../features/vehicles/form/components/SaveErrorBanner";
import RequiredFieldsSection from "../features/vehicles/form/components/RequiredFieldsSection";
import OptionalFieldsSection from "../features/vehicles/form/components/OptionalFieldsSection";
import VehicleFormSkeleton from "../features/vehicles/form/components/VehicleFormSkeleton";
import NotFoundState from "../features/vehicles/form/components/NotFoundState";
import { useVehicleForm } from "../features/vehicles/form/hooks/useVehicleForm";

export default function VehicleFormPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.user?.role);
  const canCreate = role === "ADMIN";
  const canEdit = role === "ADMIN" || role === "FLEET_MANAGER";
  const { items, status, saveStatus, saveError } = useAppSelector((s) => s.vehicles);

  const mode: Mode = vehicleId ? "edit" : "create";

  useEffect(() => {
    if (status === "idle") dispatch(fetchVehicles());
  }, [dispatch, status]);

  useEffect(() => {
    if (mode === "create" && !canCreate) navigate("/vehicles", { replace: true });
    if (mode === "edit" && !canEdit) navigate("/vehicles", { replace: true });
  }, [mode, canCreate, canEdit, navigate]);

  const existing = useMemo(
    () => (mode === "edit" ? items.find((v) => v.id === vehicleId) : undefined),
    [items, mode, vehicleId]
  );

  const {
    form,
    setField,
    markTouched,
    showError,
    isValid,
    dirtyRef,
  } = useVehicleForm({
    mode,
    vehicleId,
    items,
    existing,
    saveStatus,
    onSaveSuccess: (id, key) => {
      dispatch(clearSaveState());
      try {
        localStorage.removeItem(key);
      } catch {}
      alert("Vehicle saved successfully ✅");
      navigate(`/vehicles/${id}`);
    },
  });

  const title = mode === "create" ? "Add Vehicle" : `Edit Vehicle · ${form.id}`;

  const handleCancel = () => {
    if (dirtyRef.current && !confirm("Discard unsaved changes?")) return;
    navigate(-1);
  };

  const handleSave = () => dispatch(saveVehicle(form));

  if (status === "loading" || status === "idle") return <VehicleFormSkeleton />;

  if (mode === "edit" && !existing) return <NotFoundState onBack={() => navigate("/vehicles")} />;

  return (
    <div className="space-y-5">
      <VehicleFormHeader
        title={title}
        subtitle="Required fields are validated in real time. VIN must be unique and 17 characters."
        saving={saveStatus === "saving"}
        canSave={isValid}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      {saveStatus === "save_failed" ? (
        <SaveErrorBanner error={saveError} onRetry={handleSave} />
      ) : null}

      <Card className="p-6 space-y-6">
        <RequiredFieldsSection
          form={form}
          setField={setField}
          markTouched={markTouched}
          showError={showError}
        />
        <OptionalFieldsSection form={form} setField={setField} />
      </Card>

      <div className="text-xs text-slate-400">
        Tip: This form auto-saves drafts to localStorage and warns on tab close if you have unsaved changes.
      </div>
    </div>
  );
}
