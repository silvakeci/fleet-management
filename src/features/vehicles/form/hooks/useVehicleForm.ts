import { useEffect, useMemo, useRef, useState } from "react";
import type { Vehicle } from "../../../../types/vehicle";
import { COLORS, CURRENT_YEAR } from "../constants";
import { makeNewId, validateVehicle, type Mode } from "../utils";

export function useVehicleForm({
  mode,
  vehicleId,
  items,
  existing,
  saveStatus,
  onSaveSuccess,
}: {
  mode: Mode;
  vehicleId?: string;
  items: Vehicle[];
  existing?: Vehicle;
  saveStatus: "idle" | "saving" | "saved" | "save_failed";
  onSaveSuccess: (id: string, autosaveKey: string) => void;
}) {
  const autosaveKey = mode === "edit" ? `fleet.vehicle.form.${vehicleId}` : `fleet.vehicle.form.new`;

  const initial: Vehicle = useMemo(() => {
    try {
      const raw = localStorage.getItem(autosaveKey);
      if (raw) return JSON.parse(raw) as Vehicle;
    } catch {}

    if (mode === "edit" && existing) return existing;

    const id = makeNewId(items.map((v) => v.id));
    const today = new Date().toISOString().slice(0, 10);

    return {
      id,
      make: "",
      model: "",
      year: CURRENT_YEAR,
      vin: "",
      status: "ACTIVE",
      currentMileage: 1,
      lastServiceDate: today,

      licensePlate: "",
      color: COLORS[0],
      purchaseDate: today,

      fuelType: undefined,
      transmission: undefined,
      purchasePrice: undefined,
      notes: "",
      assignedDriverName: undefined,
    };
  }, [autosaveKey, existing, items, mode]);

  const [form, setForm] = useState<Vehicle>(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const dirtyRef = useRef(false);

  const setField = <K extends keyof Vehicle>(key: K, value: Vehicle[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: keyof Vehicle) => {
    setTouched((t) => ({ ...t, [String(key)]: true }));
  };

  useEffect(() => {
    dirtyRef.current = true;
  }, [form]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(autosaveKey, JSON.stringify(form));
      } catch {}
    }, 400);
    return () => window.clearTimeout(t);
  }, [form, autosaveKey]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const errors = useMemo(() => validateVehicle(form, items, mode), [form, items, mode]);
  const isValid = Object.keys(errors).length === 0;

  const showError = (key: keyof Vehicle): string | undefined => {
    return touched[String(key)] ? errors[String(key)] : undefined;
  };

  useEffect(() => {
    if (saveStatus === "saved") {
      dirtyRef.current = false;
      onSaveSuccess(form.id, autosaveKey);
    }
  }, [saveStatus, onSaveSuccess, form.id, autosaveKey]);

  return {
    autosaveKey,
    form,
    setField,
    markTouched,
    showError,
    isValid,
    dirtyRef,
  };
}
