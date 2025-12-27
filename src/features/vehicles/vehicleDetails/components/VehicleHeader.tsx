import { Button } from "../../../../components/ui";
import StatusBadge from "../../StatusBadge";
import type { Vehicle } from "../../../../types/vehicle";

export default function VehicleHeader({
  vehicle,
  canEdit,
  onBack,
  onEdit,
}: {
  vehicle: Vehicle;
  canEdit: boolean;
  onBack: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {vehicle.make} {vehicle.model} · {vehicle.id}
          </h1>
          <StatusBadge status={vehicle.status} />
        </div>
        <p className="text-sm text-slate-500 mt-1">
          VIN {vehicle.vin} · Year {vehicle.year}
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        {canEdit && <Button onClick={onEdit}>Edit Vehicle</Button>}
      </div>
    </div>
  );
}
