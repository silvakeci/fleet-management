import { Card } from "../../../../components/ui";
import type { Vehicle } from "../../../../types/vehicle";
import SectionTitle from "./SectionTitle";

export default function BasicInfoCard({
  vehicle,
  specs,
}: {
  vehicle: Vehicle;
  specs: { licensePlate: string; color: string; purchaseDate: string } | null;
}) {
  return (
    <Card className="p-6 space-y-4">
      <SectionTitle title="Basic Information" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-slate-500">License Plate</div>
          <div className="font-medium">{specs?.licensePlate}</div>
        </div>
        <div>
          <div className="text-slate-500">Color</div>
          <div className="font-medium">{specs?.color}</div>
        </div>
        <div>
          <div className="text-slate-500">Purchase Date</div>
          <div className="font-medium">{specs?.purchaseDate}</div>
        </div>
        <div>
          <div className="text-slate-500">Assigned Driver</div>
          <div className="font-medium">{vehicle.assignedDriverName ?? "Unassigned"}</div>
        </div>

        <div>
          <div className="text-slate-500">Current Mileage</div>
          <div className="font-medium">{vehicle.currentMileage.toLocaleString()} km</div>
        </div>
        <div>
          <div className="text-slate-500">Last Service Date</div>
          <div className="font-medium">{vehicle.lastServiceDate}</div>
        </div>
        <div>
          <div className="text-slate-500">Status</div>
          <div className="font-medium">{vehicle.status}</div>
        </div>
        <div>
          <div className="text-slate-500">VIN</div>
          <div className="font-medium">{vehicle.vin}</div>
        </div>
      </div>
    </Card>
  );
}
