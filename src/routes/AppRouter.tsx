import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import RequireAuth from "../features/auth/RequireAuth";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const VehiclesPage = lazy(() => import("../pages/VehiclesPage"));
const DriversPage = lazy(() => import("../pages/DriversPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const VehicleDetailsPage = lazy(() => import("../pages/VehicleDetailsPage"));
const VehicleFormPage = lazy(() => import("../pages/VehicleFormPage"));
const MaintenanceSchedulePage = lazy(() => import("../pages/MaintenanceSchedulePage"))
const MaintenanceLogPage = lazy(() => import("../pages/MaintenanceLogPage"))
const MaintenanceCreatePage = lazy(() => import("../pages/MaintenanceCreatePage"))
const DriverDetailsPage = lazy(() => import("../pages/DriverDetailsPage"));
const VehicleAssignmentPage = lazy(() => import("../pages/VehicleAssignmentPage"));
const ReportsOverviewPage = lazy(() => import("../pages/ReportsOverviewPage"))
const UtilizationReportPage = lazy(() => import("../pages/UtilizationReportPage"))
const CostAnalysisPage = lazy(() => import("../pages/CostAnalysisPage"))



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
                    <Route path="/vehicles/:vehicleId" element={<VehicleDetailsPage />} />
                    <Route path="/vehicles/new" element={<VehicleFormPage />} />
                    <Route path="/vehicles/:vehicleId/edit" element={<VehicleFormPage />} />
                    <Route path="/maintenance" element={<MaintenanceSchedulePage />} />
                    <Route path="/maintenance/log" element={<MaintenanceLogPage />} />
                    <Route path="/maintenance/new" element={<MaintenanceCreatePage />} />
                    <Route path="/drivers" element={<DriversPage />} />
                    <Route path="/drivers/:driverId" element={<DriverDetailsPage />} />
                    <Route path="/assignments" element={<VehicleAssignmentPage />} />
                    <Route path="/reports" element={<ReportsOverviewPage />} />
                    <Route path="/reports/utilization" element={<UtilizationReportPage />} />
                    <Route path="/reports/costs" element={<CostAnalysisPage />} />



                </Route>
            </Route>

            <Route path="*" element={<div className="p-6">Not found</div>} />
        </Routes>
    );
}
