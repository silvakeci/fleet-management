import type { Vehicle } from "../../types/vehicle";

export async function saveVehicleApi(vehicle: Vehicle): Promise<Vehicle> {
  await new Promise((r) => setTimeout(r, 700));

  if (Math.random() < 0.12) {
    throw new Error("Network error while saving. Please retry.");
  }

  return vehicle;
}
