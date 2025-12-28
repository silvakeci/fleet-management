import { memo, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import type { MaintenanceLogRow } from "../utils/toLogRows";

function MaintenanceLogTableImpl({ rows }: { rows: MaintenanceLogRow[] }) {
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    suppressHeaderMenuButton: true,
  }), []);

  const colDefs = useMemo<ColDef<MaintenanceLogRow>[]>(() => [
    { field: "date", headerName: "Date", minWidth: 140 },
    { field: "vehicleLabel", headerName: "Vehicle", minWidth: 220 },
    { field: "serviceType", headerName: "Service Type", minWidth: 170 },
    { field: "cost", headerName: "Cost", minWidth: 120, valueFormatter: (p) => `€ ${Number(p.value).toLocaleString()}` },
    { field: "mileageAtService", headerName: "Mileage", minWidth: 140, valueFormatter: (p) => `${Number(p.value).toLocaleString()} km` },
    { field: "technician", headerName: "Technician", minWidth: 160 },
    { field: "notes", headerName: "Notes", minWidth: 260, flex: 1 },
  ], []);

  return (
    <div className="ag-theme-quartz w-full" style={{ height: 680 }}>
      <AgGridReact<MaintenanceLogRow>
        rowData={rows}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination
        paginationPageSize={25}
        paginationPageSizeSelector={[25, 50, 100]}
        suppressCellFocus
      />
    </div>
  );
}

export default memo(MaintenanceLogTableImpl);
