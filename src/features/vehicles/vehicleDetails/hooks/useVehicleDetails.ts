import { useMemo, useState } from "react";
import type { Vehicle } from "../../../../types/vehicle";
import type { ServiceType } from "../../../../types/vehicleDetails";
import {
  getAssignmentHistory,
  getMaintenanceHistory,
  getVehicleExtraSpecs,
} from "../../vehicleDetailsMock";

export function useVehicleDetails(vehicle: Vehicle | undefined) {
  const specs = useMemo(() => (vehicle ? getVehicleExtraSpecs(vehicle) : null), [vehicle]);
  const maintenance = useMemo(() => (vehicle ? getMaintenanceHistory(vehicle) : []), [vehicle]);
  const assignments = useMemo(() => (vehicle ? getAssignmentHistory(vehicle) : []), [vehicle]);

  const [serviceType, setServiceType] = useState<ServiceType | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredMaintenance = useMemo(() => {
    let data = maintenance;
    if (serviceType !== "ALL") data = data.filter((r) => r.serviceType === serviceType);
    if (fromDate) data = data.filter((r) => r.date >= fromDate);
    if (toDate) data = data.filter((r) => r.date <= toDate);
    return data.sort((a, b) => b.date.localeCompare(a.date));
  }, [maintenance, serviceType, fromDate, toDate]);

  const analytics = useMemo(() => {
    if (!vehicle || !specs) return null;

    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const seed = Number(vehicle.id.replace(/\D/g, "")) || 7;

    const costs = months.map((m, i) => ({ m, v: 200 + ((seed + i * 37) % 380) }));
    const max = Math.max(...costs.map((x) => x.v));

    return {
      currentMileage: vehicle.currentMileage,
      avgFuelConsumption: specs.avgFuelConsumption,
      totalFuelCost: specs.totalFuelCost,
      costs,
      max,
    };
  }, [vehicle, specs]);

  return {
    specs,
    maintenance,
    assignments,
    analytics,
    filters: { serviceType, fromDate, toDate },
    actions: { setServiceType, setFromDate, setToDate },
    filteredMaintenance,
  };
}
