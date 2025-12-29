import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import { fetchDrivers } from "../features/drivers/driversSlice";
import { fetchMaintenance } from "../features/maintenance/maintenanceSlice";

export const bootstrapAppData = createAsyncThunk(
  "app/bootstrap",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;

    if (state.vehicles.status === "succeeded") return true;

    await dispatch(fetchVehicles()).unwrap();

    await dispatch(fetchDrivers()).unwrap();

    await dispatch(fetchMaintenance()).unwrap();

    return true;
  }
);
