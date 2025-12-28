import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { MaintenanceRecord } from "../../types/maintenance";
import type { RootState } from "../../app/store";
import { fetchMaintenanceApi } from "./maintenanceApi";
import { updateVehicleLastServiceDate } from "../vehicles/vehiclesSlice";

type State = {
  items: MaintenanceRecord[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;

  createStatus: "idle" | "saving" | "saved" | "save_failed";
  createError: string | null;
};

const initialState: State = {
  items: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
};

function resolveServiceDate(r: MaintenanceRecord): string {
  return r.completedDate ?? r.scheduledDate;
}

export const fetchMaintenance = createAsyncThunk(
  "maintenance/fetchMaintenance",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const vehicles = state.vehicles.items;
    return await fetchMaintenanceApi(vehicles);
  }
);


export const createMaintenance = createAsyncThunk(
  "maintenance/createMaintenance",
  async (record: MaintenanceRecord, { dispatch }) => {
    if (record.status === "COMPLETED") {
      dispatch(
        updateVehicleLastServiceDate({
          vehicleId: record.vehicleId,
          lastServiceDate: resolveServiceDate(record),
        })
      );
    }
    return record;
  }
);


export const completeMaintenance = createAsyncThunk(
  "maintenance/completeMaintenance",
  async (
    payload: {
      id: string;
      completedDate: string;
      cost: number;
      mileageAtService: number;
      technician: string;
      notes?: string;
    },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const existing = state.maintenance.items.find((x) => x.id === payload.id);
    if (!existing) throw new Error("Maintenance record not found");

    const updated: MaintenanceRecord = {
      ...existing,
      status: "COMPLETED",
      completedDate: payload.completedDate,
      cost: payload.cost,
      mileageAtService: payload.mileageAtService,
      technician: payload.technician,
      notes: payload.notes,
    };

    dispatch(
      updateVehicleLastServiceDate({
        vehicleId: updated.vehicleId,
        lastServiceDate: resolveServiceDate(updated),
      })
    );

    return updated;
  }
);

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    clearCreateState(state) {
      state.createStatus = "idle";
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenance.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMaintenance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMaintenance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load maintenance";
      })

      .addCase(createMaintenance.pending, (state) => {
        state.createStatus = "saving";
        state.createError = null;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.createStatus = "saved";
        state.createError = null;
        state.items.unshift(action.payload);
      })
      .addCase(createMaintenance.rejected, (state, action) => {
        state.createStatus = "save_failed";
        state.createError = action.error.message ?? "Failed to create maintenance record";
      })

      .addCase(completeMaintenance.pending, (state) => {
        state.createStatus = "saving";
        state.createError = null;
      })
      .addCase(completeMaintenance.fulfilled, (state, action) => {
        state.createStatus = "saved";
        state.createError = null;

        const idx = state.items.findIndex((x) => x.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(completeMaintenance.rejected, (state, action) => {
        state.createStatus = "save_failed";
        state.createError = action.error.message ?? "Failed to complete maintenance record";
      });
  },
});

export const { clearCreateState } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
