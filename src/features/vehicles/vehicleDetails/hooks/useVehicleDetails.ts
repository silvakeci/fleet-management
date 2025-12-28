import { useMemo, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import type { Vehicle } from "../../../../types/vehicle";
import type { DriverAssignmentHistoryItem } from "../../../../types/driver";
import type { MaintenanceRecord, MaintenanceServiceType } from "../../../../types/maintenance";

import { getVehicleExtraSpecs } from "../../vehicleDetailsMock";

function recordDate(r: MaintenanceRecord) {
  return r.completedDate ?? r.scheduledDate;
}

export function useVehicleDetails(vehicle?: Vehicle) {
  const maintenanceItems = useAppSelector((s) => s.maintenance.items);
  const drivers = useAppSelector((s) => s.drivers.items);

  const specs = useMemo(() => (vehicle ? getVehicleExtraSpecs(vehicle) : null), [vehicle]);

  const maintenance = useMemo(() => {
    if (!vehicle) return [];
    return maintenanceItems
      .filter((m) => m.vehicleId === vehicle.id)
      .sort((a, b) => recordDate(b).localeCompare(recordDate(a)));
  }, [maintenanceItems, vehicle]);

  const assignments = useMemo<DriverAssignmentHistoryItem[]>(() => {
    if (!vehicle) return [];

    const all: DriverAssignmentHistoryItem[] = [];

    for (const d of drivers) {
      for (const h of d.assignmentHistory ?? []) {
        if (h.vehicleId === vehicle.id) {
          all.push({
            ...h,
            vehicleLabel: `${d.name} (${d.id})`,
          });
        }
      }
    }

    return all.sort((a, b) => (b.from ?? "").localeCompare(a.from ?? ""));
  }, [drivers, vehicle]);

  const [serviceType, setServiceType] = useState<MaintenanceServiceType | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredMaintenance = useMemo(() => {
    let data = maintenance;

    if (serviceType !== "ALL") data = data.filter((r) => r.serviceType === serviceType);
    if (fromDate) data = data.filter((r) => recordDate(r) >= fromDate);
    if (toDate) data = data.filter((r) => recordDate(r) <= toDate);

    return data;
  }, [maintenance, serviceType, fromDate, toDate]);

  const analytics = useMemo(() => {
    if (!vehicle || !specs) return null;

    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const seed = Number(vehicle.id.replace(/\D/g, "")) || 7;

    const costs = months.map((m, i) => ({
      m,
      v: 200 + ((seed + i * 37) % 380),
    }));

    const max = Math.max(...costs.map((x) => x.v));

    return {
      currentMileage: vehicle.currentMileage,
      avgFuelConsumption: specs.avgFuelConsumption,
      totalFuelCost: specs.totalFuelCost,
      costs,
      max,
    };
  }, [vehicle, specs]);

  const filters = { serviceType, fromDate, toDate };
  const actions = {
    setServiceType,
    setFromDate,
    setToDate,
    clear: () => {
      setServiceType("ALL");
      setFromDate("");
      setToDate("");
    },
  };

  return {
    specs,
    maintenance,
    filteredMaintenance,
    assignments,
    analytics,
    filters,
    actions,
  };
}
