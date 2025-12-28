export async function deleteVehicleApi(vehicleId: string): Promise<{ id: string }> {
    await new Promise((r) => setTimeout(r, 350));
    return { id: vehicleId };
  }
  