import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import vehiclesReducer from "../features/vehicles/vehiclesSlice";
import maintenanceReducer from "../features/maintenance/maintenanceSlice";
import driversReducer from "../features/drivers/driversSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    maintenance: maintenanceReducer,
    drivers: driversReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
