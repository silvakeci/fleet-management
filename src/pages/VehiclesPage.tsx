import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchVehicles } from "../features/vehicles/vehiclesSlice";
import { Card } from "../components/ui";
import PageHeader from "../components/PageHeader";

import VehiclesToolbar from "../features/vehicles/list/components/VehiclesToolbar";
import VehiclesStats from "../features/vehicles/list/components/VehiclesStats";
import {
  VehiclesLoading,
  VehiclesError,
  VehiclesEmpty,
  VehiclesNoResults,
  shouldShowEmpty,
  shouldShowNoResults,
  shouldShowTable,
} from "../features/vehicles/list/components/VehiclesStates";
import { filterVehicles } from "../features/vehicles/list/utils/filterVehicles";

const VehiclesTable = lazy(() => import("../features/vehicles/VehiclesTable"));

export default function VehiclesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const role = useAppSelector((s) => s.auth.user?.role);
  const canCreate = role === "ADMIN";

  const { items, status, error } = useAppSelector((s) => s.vehicles);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchVehicles());
  }, [dispatch, status]);

  const filtered = useMemo(() => filterVehicles(items, search), [items, search]);

  const onRefresh = () => dispatch(fetchVehicles());
  const onCreate = () => navigate("/vehicles/new");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vehicles"
        subtitle="View and manage all fleet vehicles. Click a row to open vehicle details."
        right={
          <VehiclesToolbar
            search={search}
            onSearchChange={setSearch}
            loading={status === "loading"}
            canCreate={canCreate}
            onRefresh={onRefresh}
            onCreate={onCreate}
          />
        }
      />

      <VehiclesStats vehicles={items} />

      {status === "loading" ? <VehiclesLoading /> : null}

      {status === "failed" ? (
        <VehiclesError error={error} onRetry={onRefresh} />
      ) : null}

      {shouldShowEmpty(status, items) ? (
        <VehiclesEmpty canCreate={canCreate} onCreate={onCreate} />
      ) : null}

      {shouldShowNoResults(status, items, filtered) ? (
        <VehiclesNoResults
          canCreate={canCreate}
          onCreate={onCreate}
          onClear={() => setSearch("")}
        />
      ) : null}

      {shouldShowTable(status, filtered) ? (
        <Suspense fallback={<Card className="p-6">Loading table…</Card>}>
          <VehiclesTable
            rowData={filtered}
            quickFilterText={search}
            onRowClick={(id) => navigate(`/vehicles/${id}`)}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
