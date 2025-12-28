import { memo, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import type { Driver } from "../../../types/driver";
import DriverStatusBadge from "./DriverStatusBadge";

type Row = {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  assignedVehicles: string;
  status: Driver["status"];
};

function DriversTableImpl({
  drivers,
  onRowClick,
}: {
  drivers: Driver[];
  onRowClick: (driverId: string) => void;
}) {
  const rows = useMemo<Row[]>(() => {
    return drivers.map((d) => ({
      id: d.id,
      name: d.name,
      licenseNumber: d.licenseNumber,
      phone: d.phone,
      email: d.email,
      assignedVehicles: d.assignedVehicleIds.length ? d.assignedVehicleIds.join(", ") : "—",
      status: d.status,
    }));
  }, [drivers]);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    suppressHeaderMenuButton: true,
  }), []);

  const colDefs = useMemo<ColDef<Row>[]>(() => [
    { field: "id", headerName: "ID", minWidth: 120 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "licenseNumber", headerName: "License #", minWidth: 160 },
    { field: "phone", headerName: "Phone", minWidth: 160 },
    { field: "email", headerName: "Email", minWidth: 220 },
    { field: "assignedVehicles", headerName: "Assigned Vehicle(s)", minWidth: 220, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      cellRenderer: (p: any) => <DriverStatusBadge status={p.value} />,
      filter: true,
    },
  ], []);

  return (
    <div className="ag-theme-quartz w-full" style={{ height: 680 }}>
      <AgGridReact<Row>
        rowData={rows}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination
        paginationPageSize={25}
        paginationPageSizeSelector={[25, 50, 100]}
        onRowClicked={(e) => {
            const id = e.data?.id;
            if (!id) return;
            onRowClick(id);
          }}
      />
    </div>
  );
}

export default memo(DriversTableImpl);
