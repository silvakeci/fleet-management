import { Button } from "../../../../components/ui";

export default function VehicleFormHeader({
  title,
  subtitle,
  saving,
  canSave,
  onCancel,
  onSave,
}: {
  title: string;
  subtitle: string;
  saving: boolean;
  canSave: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="button" loading={saving} disabled={!canSave || saving} onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
