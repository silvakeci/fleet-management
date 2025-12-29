import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Driver, DriverAssignmentHistoryItem } from "../../types/driver";
import type { RootState } from "../../app/store";
import { fetchDriversApi } from "./driversApi";
import { saveAssignmentApi } from "./assignmentApi";

type AssignmentAction = "ASSIGN" | "UNASSIGN";

type DriversState = {
  items: Driver[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;

  assignStatus: "idle" | "saving" | "saved" | "save_failed";
  assignError: string | null;

  lastAssignAction: AssignmentAction | null;
};

const initialState: DriversState = {
  items: [],
  status: "idle",
  error: null,
  assignStatus: "idle",
  assignError: null,
  lastAssignAction: null,
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function makeHistoryId(driverId: string, vehicleId: string) {
  return `AH-${driverId}-${vehicleId}-${Date.now()}`;
}

export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const vehicles = state.vehicles.items;
    return await fetchDriversApi(vehicles);
  }
);

export const saveAssignment = createAsyncThunk(
  "drivers/saveAssignment",
  async (payload: { driverId: string; vehicleId: string; action: AssignmentAction }) => {
    await saveAssignmentApi();
    return payload;
  }
);

const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    clearDriversError(state) {
      state.error = null;
    },
    clearAssignState(state) {
      state.assignStatus = "idle";
      state.assignError = null;
      state.lastAssignAction = null; 
    },

    assignVehicleLocal(
      state,
      action: PayloadAction<{
        driverId: string;
        vehicleId: string;
        vehicleLabel: string;
      }>
    ) {
      const { driverId, vehicleId, vehicleLabel } = action.payload;
      const today = todayISO();

      for (const d of state.items) {
        if (d.assignedVehicleIds.includes(vehicleId)) {
          d.assignedVehicleIds = d.assignedVehicleIds.filter((id) => id !== vehicleId);
        }

        const openForVehicle = d.assignmentHistory?.find(
          (h) => h.vehicleId === vehicleId && !h.to
        );
        if (openForVehicle) openForVehicle.to = today;
      }

      const driver = state.items.find((d) => d.id === driverId);
      if (!driver) return;

      driver.assignedVehicleIds = driver.assignedVehicleIds ?? [];
      driver.assignmentHistory = driver.assignmentHistory ?? [];

      const currentVehicle = driver.assignedVehicleIds[0];
      if (currentVehicle && currentVehicle !== vehicleId) {
        driver.assignedVehicleIds = [];

        const openForOld = driver.assignmentHistory.find(
          (h) => h.vehicleId === currentVehicle && !h.to
        );
        if (openForOld) openForOld.to = today;
      }

      driver.assignedVehicleIds = [vehicleId];

      const newHist: DriverAssignmentHistoryItem = {
        id: makeHistoryId(driverId, vehicleId),
        vehicleId,
        vehicleLabel,
        from: today,
        to: undefined,
      };

      driver.assignmentHistory.unshift(newHist);
    },

    unassignVehicleLocal(
      state,
      action: PayloadAction<{ driverId: string; vehicleId: string }>
    ) {
      const { driverId, vehicleId } = action.payload;
      const today = todayISO();

      const driver = state.items.find((d) => d.id === driverId);
      if (!driver) return;

      driver.assignedVehicleIds = (driver.assignedVehicleIds ?? []).filter(
        (id) => id !== vehicleId
      );

      driver.assignmentHistory = driver.assignmentHistory ?? [];
      const open = driver.assignmentHistory.find((h) => h.vehicleId === vehicleId && !h.to);
      if (open) open.to = today;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load drivers";
      })

      .addCase(saveAssignment.pending, (state) => {
        state.assignStatus = "saving";
        state.assignError = null;
        state.lastAssignAction = null;
      })
      .addCase(saveAssignment.fulfilled, (state, action) => {
        state.assignStatus = "saved";
        state.lastAssignAction = action.payload.action; 
      })
      .addCase(saveAssignment.rejected, (state, action) => {
        state.assignStatus = "save_failed";
        state.assignError = action.error.message ?? "Failed to save assignment";
        state.lastAssignAction = null;
      });
  },
});

export const {
  clearDriversError,
  clearAssignState,
  assignVehicleLocal,
  unassignVehicleLocal,
} = driversSlice.actions;

export default driversSlice.reducer;
