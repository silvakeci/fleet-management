import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import RequireAuth from "../features/auth/RequireAuth";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const VehiclesPage = lazy(() => import("../pages/VehiclesPage"));
const DriversPage = lazy(() => import("../pages/DriversPage"));
const MaintenancePage = lazy(() => import("../pages/MaintenancePage"));
const ReportsPage = lazy(() => import("../pages/ReportsPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const VehicleDetailsPage = lazy(() => import("../pages/VehicleDetailsPage"));
const VehicleFormPage = lazy(() => import("../pages/VehicleFormPage"));

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/vehicles/:vehicleId" element={<VehicleDetailsPage />} />
          <Route path="/vehicles/new" element={<VehicleFormPage />} />
          <Route path="/vehicles/:vehicleId/edit" element={<VehicleFormPage />} />

        </Route>
      </Route>

      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
