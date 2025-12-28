import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchVehicles, deleteVehicle } from "../features/vehicles/vehiclesSlice";
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
    const { deleteStatus, deleteError } = useAppSelector((s) => s.vehicles);
    const { items, status, error } = useAppSelector((s) => s.vehicles);
    const [search, setSearch] = useState("");
    
    const filtered = useMemo(() => filterVehicles(items, search), [items, search]);

    const role = useAppSelector((s) => s.auth.user?.role);

    const canCreate = role === "ADMIN";
    const onRefresh = () => dispatch(fetchVehicles());
    const onCreate = () => navigate("/vehicles/new");

    const handleDelete = (id: string) => {
        const ok = confirm(`Delete vehicle ${id}? This cannot be undone.`);
        if (!ok) return;
        dispatch(deleteVehicle(id));
    };

    useEffect(() => {
        if (status === "idle") dispatch(fetchVehicles());
    }, [dispatch, status]);

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
                        canDelete={canCreate}
                        onRowClick={(id) => navigate(`/vehicles/${id}`)}
                        onDelete={handleDelete}
                    />
                </Suspense>
            ) : null}
            {deleteStatus === "delete_failed" && (
                <Card className="p-4 border-red-200 bg-red-50">
                    <div className="font-semibold text-red-800">Delete failed</div>
                    <div className="text-sm text-red-700 mt-1">{deleteError}</div>
                </Card>
            )}

        </div>
    );
}
