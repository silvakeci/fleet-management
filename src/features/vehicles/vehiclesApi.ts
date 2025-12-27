import type { Vehicle, VehicleStatus } from "../../types/vehicle";

const MAKES = ["Ford", "Toyota", "Mercedes", "Volkswagen", "Renault", "Nissan"];

const MODELS: Record<string, string[]> = {
  Ford: ["Transit", "Ranger", "Focus"],
  Toyota: ["Camry", "Hilux", "Corolla"],
  Mercedes: ["Sprinter", "Vito"],
  Volkswagen: ["Transporter", "Caddy"],
  Renault: ["Trafic", "Kangoo"],
  Nissan: ["Navara", "NV200"],
};

const COLORS = ["White", "Black", "Silver", "Blue", "Red", "Gray"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isoDateDaysAgo(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function makeVin(i: number) {
  // fake VIN-like 17 chars (alphanumeric)
  const base = `FLEET${String(i).padStart(12, "0")}`;
  return base.slice(0, 17);
}

function statusFrom(i: number): VehicleStatus {
  const mod = i % 12;
  if (mod === 0) return "RETIRED";
  if (mod <= 2) return "MAINTENANCE";
  return "ACTIVE";
}

export async function fetchVehiclesApi(): Promise<Vehicle[]> {
  await new Promise((r) => setTimeout(r, 600));

  const vehicles: Vehicle[] = Array.from({ length: 360 }).map((_, idx) => {
    const i = idx + 1;

    const make = randomFrom(MAKES);
    const model = randomFrom(MODELS[make]);
    const year = randomInt(2012, 2025);
    const currentMileage = randomInt(10_000, 240_000);
    const status = statusFrom(i);
    const lastServiceDate = isoDateDaysAgo(randomInt(10, 220));

    const assignedDriverName =
      i % 5 === 0 ? undefined : `Driver ${String((i % 40) + 1).padStart(2, "0")}`;

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

      assignedDriverName,
    };
  });

  return vehicles;
}
