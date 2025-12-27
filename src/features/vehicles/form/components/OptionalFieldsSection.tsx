import { Input, Select } from "../../../../components/ui";
import type { FuelType, Transmission, Vehicle } from "../../../../types/vehicle";

export default function OptionalFieldsSection({
  form,
  setField,
}: {
  form: Vehicle;
  setField: <K extends keyof Vehicle>(key: K, value: Vehicle[K]) => void;
}) {
  return (
    <div className="border-t pt-6 space-y-4">
      <div>
        <div className="text-sm font-semibold">Optional</div>
        <div className="text-sm text-slate-500">These fields are not required.</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Select
          label="Fuel Type"
          value={form.fuelType ?? ""}
          onChange={(e) =>
            setField("fuelType", (e.target.value || undefined) as FuelType | undefined)
          }
        >
          <option value="">—</option>
          <option value="GASOLINE">Gasoline</option>
          <option value="DIESEL">Diesel</option>
          <option value="ELECTRIC">Electric</option>
          <option value="HYBRID">Hybrid</option>
        </Select>

        <Select
          label="Transmission"
          value={form.transmission ?? ""}
          onChange={(e) =>
            setField("transmission", (e.target.value || undefined) as Transmission | undefined)
          }
        >
          <option value="">—</option>
          <option value="AUTOMATIC">Automatic</option>
          <option value="MANUAL">Manual</option>
        </Select>

        <Input
          label="Purchase Price"
          type="number"
          value={form.purchasePrice === undefined ? "" : String(form.purchasePrice)}
          onChange={(e) =>
            setField("purchasePrice", e.target.value === "" ? undefined : Number(e.target.value))
          }
          min={0}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:ring-1 focus:ring-black focus:border-black"
          rows={4}
          value={form.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </div>
    </div>
  );
}
