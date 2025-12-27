import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Vehicle } from "../../types/vehicle";
import { fetchVehiclesApi } from "./vehiclesApi";
import { saveVehicleApi } from "./vehiclesSaveApi";

export type VehiclesStatus = "idle" | "loading" | "succeeded" | "failed";

type VehiclesState = {
  items: Vehicle[];
  status: VehiclesStatus;
  error: string | null;

  saveStatus: "idle" | "saving" | "saved" | "save_failed";
  saveError: string | null;
};

const initialState: VehiclesState = {
  items: [],
  status: "idle",
  error: null,
  saveStatus: "idle",
  saveError: null,
};

export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async () => {
  return await fetchVehiclesApi();
});

export const saveVehicle = createAsyncThunk(
  "vehicles/saveVehicle",
  async (vehicle: Vehicle) => {
    return await saveVehicleApi(vehicle);
  }
);

function upsert(items: Vehicle[], vehicle: Vehicle) {
  const idx = items.findIndex((v) => v.id === vehicle.id);
  if (idx >= 0) items[idx] = vehicle;
  else items.unshift(vehicle);
}

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    clearVehiclesError(state) {
      state.error = null;
    },
    clearSaveState(state) {
      state.saveStatus = "idle";
      state.saveError = null;
    },
    setVehicles(state, action: PayloadAction<Vehicle[]>) {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load vehicles";
      })

      // save
      .addCase(saveVehicle.pending, (state) => {
        state.saveStatus = "saving";
        state.saveError = null;
      })
      .addCase(saveVehicle.fulfilled, (state, action) => {
        state.saveStatus = "saved";
        state.saveError = null;
        upsert(state.items, action.payload);
      })
      .addCase(saveVehicle.rejected, (state, action) => {
        state.saveStatus = "save_failed";
        state.saveError = action.error.message ?? "Failed to save vehicle";
      });
  },
});

export const { clearVehiclesError, setVehicles, clearSaveState } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
