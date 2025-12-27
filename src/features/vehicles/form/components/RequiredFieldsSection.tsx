import { Input, Select } from "../../../../components/ui";
import type { Vehicle, VehicleStatus } from "../../../../types/vehicle";
import { COLORS, CURRENT_YEAR } from "../constants";

export default function RequiredFieldsSection({
  form,
  setField,
  markTouched,
  showError,
}: {
  form: Vehicle;
  setField: <K extends keyof Vehicle>(key: K, value: Vehicle[K]) => void;
  markTouched: (key: keyof Vehicle) => void;
  showError: (key: keyof Vehicle) => string | undefined;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Input
        label="Make *"
        value={form.make}
        onChange={(e) => setField("make", e.target.value)}
        onBlur={() => markTouched("make")}
        error={showError("make")}
      />

      <Input
        label="Model *"
        value={form.model}
        onChange={(e) => setField("model", e.target.value)}
        onBlur={() => markTouched("model")}
        error={showError("model")}
      />

      <Input
        label="Year *"
        type="number"
        value={String(form.year)}
        onChange={(e) => setField("year", Number(e.target.value))}
        onBlur={() => markTouched("year")}
        error={showError("year")}
        min={1990}
        max={CURRENT_YEAR}
      />

      <Input
        label="VIN * (17 chars)"
        value={form.vin}
        onChange={(e) => setField("vin", e.target.value)}
        onBlur={() => markTouched("vin")}
        error={showError("vin")}
      />

      <Input
        label="License Plate *"
        value={form.licensePlate}
        onChange={(e) => setField("licensePlate", e.target.value)}
        onBlur={() => markTouched("licensePlate")}
        error={showError("licensePlate")}
      />

      <Select
        label="Color *"
        value={form.color}
        onChange={(e) => setField("color", e.target.value)}
        onBlur={() => markTouched("color")}
        error={showError("color")}
      >
        {COLORS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>

      <Select
        label="Status *"
        value={form.status}
        onChange={(e) => setField("status", e.target.value as VehicleStatus)}
        onBlur={() => markTouched("status")}
        error={showError("status")}
      >
        <option value="ACTIVE">Active</option>
        <option value="MAINTENANCE">Maintenance</option>
        <option value="RETIRED">Retired</option>
      </Select>

      <Input
        label="Purchase Date *"
        type="date"
        value={form.purchaseDate}
        onChange={(e) => setField("purchaseDate", e.target.value)}
        onBlur={() => markTouched("purchaseDate")}
        error={showError("purchaseDate")}
      />

      <Input
        label="Current Mileage *"
        type="number"
        value={String(form.currentMileage)}
        onChange={(e) => setField("currentMileage", Number(e.target.value))}
        onBlur={() => markTouched("currentMileage")}
        error={showError("currentMileage")}
        min={1}
      />
    </div>
  );
}
