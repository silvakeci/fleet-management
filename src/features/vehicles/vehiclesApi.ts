import type { Vehicle } from "../../types/vehicle";
import { DRIVER_SEED } from "../drivers/mockDrivers";
import { MAKES, MODELS, COLORS } from "../../mocks/vehicles/vehicleConstants";
import { randomInt, randomFrom } from "../../utils/random";
import { isoDateDaysAgo } from "../../utils/dates";
import { makeVin, statusFrom } from "../../utils/vehicle";

export async function fetchVehiclesApi(): Promise<Vehicle[]> {
  await new Promise((r) => setTimeout(r, 600));

  const activeDrivers = DRIVER_SEED.filter((d) => d.status === "ACTIVE");
  const availableDriverPool = [...activeDrivers]; 

  const vehicles: Vehicle[] = Array.from({ length: 360 }).map((_, idx) => {
    const i = idx + 1;

    const make = randomFrom(MAKES);
    const model = randomFrom(MODELS[make]);

    const year = randomInt(2012, 2025);
    const currentMileage = randomInt(10_000, 240_000);
    const status = statusFrom(i);
    const lastServiceDate = isoDateDaysAgo(randomInt(10, 220));

    let assignedDriverId: string | undefined;
    let assignedDriverName: string | undefined;

    if (i % 3 !== 0 && availableDriverPool.length > 0) {
      const driver = availableDriverPool.splice(
        randomInt(0, availableDriverPool.length - 1),
        1
      )[0];

      assignedDriverId = driver.id;
      assignedDriverName = driver.name;
    }

    return {
      id: `V-${String(i).padStart(4, "0")}`,
      make,
      model,
      year,
      vin: makeVin(i),
      status,
      currentMileage,
      lastServiceDate,

      licensePlate: `AA-${String((i % 9000) + 1000)}`,
      color: COLORS[i % COLORS.length],
      purchaseDate: isoDateDaysAgo(365 * (2 + (i % 6))),

      fuelType: ["GASOLINE", "DIESEL", "HYBRID", "ELECTRIC"][i % 4] as Vehicle["fuelType"],
      transmission: i % 2 === 0 ? "AUTOMATIC" : "MANUAL",
      purchasePrice: 18_000 + (i % 20_000),
      notes: i % 7 === 0 ? "Minor cosmetic wear on interior." : undefined,

      assignedDriverId,
      assignedDriverName,
    };
  });

  return vehicles;
}
