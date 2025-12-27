import type { Vehicle } from "../../../../types/vehicle";

export function filterVehicles(items: Vehicle[], search: string) {
  const q = search.trim().toLowerCase();
  if (!q) return items;

  return items.filter((v) => {
    const assigned = v.assignedDriverName ?? "Unassigned";
    return (
      v.id.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.vin.toLowerCase().includes(q) ||
      v.status.toLowerCase().includes(q) ||
      assigned.toLowerCase().includes(q) ||
      String(v.year).includes(q)
    );
  });
}
