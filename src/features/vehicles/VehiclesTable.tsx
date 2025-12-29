import { memo, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, CellClickedEvent } from "ag-grid-community";
import type { Vehicle } from "../../types/vehicle";
import StatusBadge from "./StatusBadge";
import { useAppSelector } from "../../app/hooks";

type Props = {
  rowData: Vehicle[];
  quickFilterText?: string;
  onRowClick: (id: string) => void;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
};

function VehiclesTableImpl({
  rowData,
  quickFilterText,
  onRowClick,
  canDelete = false,
  onDelete,
}: Props) {
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

  const drivers = useAppSelector((s) => s.drivers.items);

  const driverById = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of drivers) map.set(d.id, d.name);
    return map;
  }, [drivers]);

  const colDefs = useMemo<ColDef<Vehicle>[]>(() => {
    const cols: ColDef<Vehicle>[] = [
      { field: "id", headerName: "Vehicle ID", minWidth: 130 },
      { field: "make", headerName: "Make", minWidth: 140 },
      { field: "model", headerName: "Model", minWidth: 140 },
      { field: "year", headerName: "Year", minWidth: 110 },
      { field: "vin", headerName: "VIN", minWidth: 190 },
      {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        cellRenderer: (p: any) => <StatusBadge status={p.value} />,
      },
      {
        field: "currentMileage",
        headerName: "Current Mileage",
        minWidth: 160,
        valueFormatter: (p) => `${Number(p.value).toLocaleString()} km`,
      },
      {
        field: "lastServiceDate",
        headerName: "Last Service Date",
        minWidth: 160,
      },
      {
        headerName: "Assigned Driver",
        minWidth: 170,
        valueGetter: (p) => {
          const id = p.data?.assignedDriverId;
          if (!id) return "Unassigned";
          return driverById.get(id) ?? "Unassigned";
        },
      },
    ];

    if (canDelete) {
      cols.unshift({
        headerName: "",
        colId: "actions",
        width: 90,
        pinned: "right",
        sortable: false,
        filter: false,
        resizable: false,
        cellClass: "cursor-default",
        cellRenderer: (p: any) => {
          const id = p.data?.id;
          if (!id) return null;

          return (
            <button
              type="button"
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-white hover:bg-slate-50 text-rose-700 border-rose-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(id);
              }}
            >
              Delete
            </button>
          );
        },
      });
    }

    return cols;
  }, [canDelete, onDelete, driverById]);

  const onCellClicked = useCallback(
    (e: CellClickedEvent<Vehicle>) => {
      if (e.column.getColId() === "actions") return;
      if (!e.data) return;
      onRowClick(e.data.id);
    },
    [onRowClick]
  );

  return (
    <div className="ag-theme-quartz w-full" style={{ height: 680 }}>
      <AgGridReact<Vehicle>
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowHeight={35}   
        pagination
        paginationPageSize={25}
        paginationPageSizeSelector={[25, 50, 100]}
        quickFilterText={quickFilterText}
        suppressCellFocus
        onCellClicked={onCellClicked}
      />
    </div>
  );
}

export default memo(VehiclesTableImpl);
