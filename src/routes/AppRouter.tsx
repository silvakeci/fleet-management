import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const VehiclesPage = lazy(() => import("../pages/VehiclesPage"));
const DriversPage = lazy(() => import("../pages/DriversPage"));
const MaintenancePage = lazy(() => import("../pages/MaintenancePage"));
const ReportsPage = lazy(() => import("../pages/ReportsPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
