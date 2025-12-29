import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Vehicle } from "../../types/vehicle";
import { fetchVehiclesApi } from "./vehiclesApi";
import { saveVehicleApi } from "./vehiclesSaveApi";
import { deleteVehicleApi } from "./vehiclesDeleteApi";

export type VehiclesStatus = "idle" | "loading" | "succeeded" | "failed";

type VehiclesState = {
  items: Vehicle[];
  status: VehiclesStatus;
  error: string | null;

  saveStatus: "idle" | "saving" | "saved" | "save_failed";
  saveError: string | null;

  deleteStatus: "idle" | "deleting" | "deleted" | "delete_failed";
  deleteError: string | null;
};

const initialState: VehiclesState = {
  items: [],
  status: "idle",
  error: null,

  saveStatus: "idle",
  saveError: null,

  deleteStatus: "idle",
  deleteError: null,
};

export const fetchVehicles = createAsyncThunk("vehicles/fetchVehicles", async () => {
  return await fetchVehiclesApi();
});

export const saveVehicle = createAsyncThunk("vehicles/saveVehicle", async (vehicle: Vehicle) => {
  return await saveVehicleApi(vehicle);
});

export const deleteVehicle = createAsyncThunk("vehicles/deleteVehicle", async (vehicleId: string) => {
  return await deleteVehicleApi(vehicleId);
});

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
    clearDeleteState(state) {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },

    setVehicles(state, action: PayloadAction<Vehicle[]>) {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null;
    },

    updateVehicleLastServiceDate(
      state,
      action: PayloadAction<{ vehicleId: string; lastServiceDate: string }>
    ) {
      const v = state.items.find((x) => x.id === action.payload.vehicleId);
      if (!v) return;
      v.lastServiceDate = action.payload.lastServiceDate;
    },

    setVehicleAssignedDriver(
      state,
      action: PayloadAction<{
        vehicleId: string;
        assignedDriverId?: string;
        assignedDriverName?: string;
      }>
    ) {
      const v = state.items.find((x) => x.id === action.payload.vehicleId);
      if (!v) return;

      v.assignedDriverId = action.payload.assignedDriverId;
      v.assignedDriverName = action.payload.assignedDriverName;

      if (!action.payload.assignedDriverId) {
        v.assignedDriverId = undefined;
        v.assignedDriverName = undefined;
      }
    },


    unassignVehicleFromDriver(
      state,
      action: PayloadAction<{ driverId: string }>
    ) {
      for (const v of state.items) {
        if (v.assignedDriverId === action.payload.driverId) {
          v.assignedDriverId = undefined;
          v.assignedDriverName = undefined;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
      })

      .addCase(deleteVehicle.pending, (state) => {
        state.deleteStatus = "deleting";
        state.deleteError = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.deleteStatus = "deleted";
        state.deleteError = null;
        state.items = state.items.filter((v) => v.id !== action.payload.id);
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.deleteStatus = "delete_failed";
        state.deleteError = action.error.message ?? "Failed to delete vehicle";
      });
  },
});

export const {
  clearVehiclesError,
  setVehicles,
  clearSaveState,
  clearDeleteState,
  updateVehicleLastServiceDate,
  setVehicleAssignedDriver,
  unassignVehicleFromDriver,
} = vehiclesSlice.actions;

export default vehiclesSlice.reducer;
