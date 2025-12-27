import { memo, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import type { Vehicle } from "../../types/vehicle";
import StatusBadge from "./StatusBadge";

type Props = {
  rowData: Vehicle[];
  onRowClick: (vehicleId: string) => void;
  quickFilterText: string;
};

function VehiclesTableImpl({ rowData, onRowClick, quickFilterText }: Props) {
  const apiRef = useRef<GridApi | null>(null);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
      suppressHeaderMenuButton: true,
    }),
    []
  );

  const colDefs = useMemo<ColDef<Vehicle>[]>(
    () => [
      {
        field: "id",
        headerName: "Vehicle ID",
        minWidth: 140,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        cellClass: "font-medium",
      },
      { field: "make", headerName: "Make", minWidth: 120 },
      { field: "model", headerName: "Model", minWidth: 140 },
      { field: "year", headerName: "Year", minWidth: 105, filter: "agNumberColumnFilter" },
      { field: "vin", headerName: "VIN", minWidth: 190 },
      {
        field: "status",
        headerName: "Status",
        minWidth: 160,
        cellRenderer: (p: any) => <StatusBadge status={p.value} />,
      },
      {
        field: "currentMileage",
        headerName: "Mileage",
        minWidth: 140,
        filter: "agNumberColumnFilter",
        valueFormatter: (p) =>
          typeof p.value === "number" ? p.value.toLocaleString() : p.value,
      },
      { field: "lastServiceDate", headerName: "Last Service", minWidth: 160 },
      {
        field: "assignedDriverName",
        headerName: "Assigned Driver",
        minWidth: 190,
        valueGetter: (p) => p.data?.assignedDriverName ?? "Unassigned",
      },
    ],
    []
  );

  const onGridReady = (e: GridReadyEvent) => {
    apiRef.current = e.api;
    e.api.setGridOption("quickFilterText", quickFilterText);
  };

  // keep quick filter synced without rerendering columns
  if (apiRef.current) {
    apiRef.current.setGridOption("quickFilterText", quickFilterText);
  }

  const onRowClicked = (e: RowClickedEvent<Vehicle>) => {
    if (e.data?.id) onRowClick(e.data.id);
  };

  return (
    <div className="ag-theme-quartz fleet-grid w-full" style={{ height: 660 }}>
      <AgGridReact<Vehicle>
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
        rowSelection="multiple"
        pagination={true}
        paginationPageSize={25}
        paginationPageSizeSelector={[25, 50, 100]}
        animateRows={false}
        suppressCellFocus={true}
      />
    </div>
  );
}

export default memo(VehiclesTableImpl);
