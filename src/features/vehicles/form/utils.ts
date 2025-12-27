import type { Vehicle } from "../../../types/vehicle";
import { CURRENT_YEAR } from "./constants";

export type Mode = "create" | "edit";

export function makeNewId(existingIds: string[]) {
  const nums = existingIds
    .map((id) => Number(id.replace(/\D/g, "")))
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `V-${String(next).padStart(4, "0")}`;
}

function isAlphaNum(s: string) {
  return /^[A-Za-z0-9]+$/.test(s);
}

export function validateVehicle(v: Vehicle, all: Vehicle[], mode: Mode) {
  const errors: Record<string, string> = {};

  const req = (key: keyof Vehicle, msg: string) => {
    const val = v[key];
    if (
      val === undefined ||
      val === null ||
      val === "" ||
      (typeof val === "number" && Number.isNaN(val))
    ) {
      errors[String(key)] = msg;
    }
  };

  req("make", "Make is required");
  req("model", "Model is required");
  req("year", "Year is required");
  req("vin", "VIN is required");
  req("licensePlate", "License plate is required");
  req("color", "Color is required");
  req("status", "Status is required");
  req("purchaseDate", "Purchase date is required");
  req("currentMileage", "Current mileage is required");

  if (v.year < 1990 || v.year > CURRENT_YEAR) {
    errors.year = `Year must be between 1990 and ${CURRENT_YEAR}`;
  }

  if (v.currentMileage <= 0) {
    errors.currentMileage = "Mileage must be a positive number";
  }

  const vin = (v.vin ?? "").trim();
  if (vin.length !== 17) errors.vin = "VIN must be exactly 17 characters";
  else if (!isAlphaNum(vin)) errors.vin = "VIN must be alphanumeric only";

  const normalizedVin = vin.toUpperCase();
  const duplicate = all.find((x) => x.vin?.toUpperCase() === normalizedVin);
  if (duplicate) {
    const sameRecord = mode === "edit" && duplicate.id === v.id;
    if (!sameRecord) errors.vin = `Duplicate VIN (already used by ${duplicate.id})`;
  }

  return errors;
}
