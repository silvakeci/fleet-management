import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import { Button, Card } from "../components/ui";

import VehicleHeader from "../features/vehicles/vehicleDetails/components/VehicleHeader";
import BasicInfoCard from "../features/vehicles/vehicleDetails/components/BasicInfoCard";
import MaintenanceHistoryCard from "../features/vehicles/vehicleDetails/components/MaintenanceHistoryCard";
import FuelAnalyticsCard from "../features/vehicles/vehicleDetails/components/FuelAnalyticsCard";
import AssignmentHistoryCard from "../features/vehicles/vehicleDetails/components/AssignmentHistoryCard";
import EmptyState from "../features/vehicles/vehicleDetails/components/EmptyState";

import { useVehicleDetails } from "../features/vehicles/vehicleDetails/hooks/useVehicleDetails";

export default function VehicleDetailsPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.user?.role);
  const canEdit = role === "ADMIN" ;
  const { items, status } = useAppSelector((s) => s.vehicles);
  const vehicle = useMemo(() => items.find((v) => v.id === vehicleId), [items, vehicleId]);
  const details = useVehicleDetails(vehicle);

  useEffect(() => {
    if (status === "idle") dispatch(fetchVehicles());
  }, [dispatch, status]);


  if (status === "loading" || status === "idle") {
    return (
      <div className="space-y-4">
        <div className="h-6 w-64 bg-slate-200 rounded animate-pulse" />
        <Card className="p-6">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-200 rounded" />
          </div>
        </Card>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Vehicle not found</h1>
          <Button variant="secondary" onClick={() => navigate("/vehicles")}>
            Back to Vehicles
          </Button>
        </div>
        <EmptyState title="404 — Vehicle not found" hint="The vehicle ID in the URL does not exist." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VehicleHeader
        vehicle={vehicle}
        canEdit={canEdit}
        onBack={() => navigate("/vehicles")}
        onEdit={() => navigate(`/vehicles/${vehicle.id}/edit`)}
      />
      <BasicInfoCard vehicle={vehicle} specs={details.specs} />
      <MaintenanceHistoryCard
        maintenance={details.maintenance}
        filtered={details.filteredMaintenance}
        filters={details.filters}
        actions={details.actions}
      />
      <FuelAnalyticsCard analytics={details.analytics} />
      <AssignmentHistoryCard assignments={details.assignments} />
    </div>
  );
}
