import { Button, Card, Input } from "../../../../components/ui";
import SectionTitle from "./SectionTitle";
import EmptyState from "./EmptyState";
import ServiceTypePill from "./ServiceTypePill";

import type {
  MaintenanceRecord,
  MaintenanceServiceType,
} from "../../../../types/maintenance";

type Filters = {
  serviceType: MaintenanceServiceType | "ALL";
  fromDate: string;
  toDate: string;
};

type Actions = {
  setServiceType: (v: MaintenanceServiceType | "ALL") => void;
  setFromDate: (v: string) => void;
  setToDate: (v: string) => void;
  clear: () => void;
};

function recordDate(r: MaintenanceRecord) {
  return r.completedDate ?? r.scheduledDate;
}

function formatMoney(v?: number) {
  if (v === undefined) return "—";
  return `€ ${v.toLocaleString()}`;
}

function formatKm(v?: number) {
  if (v === undefined) return "—";
  return `${v.toLocaleString()} km`;
}

export default function MaintenanceHistoryCard({
  maintenance,
  filtered,
  filters,
  actions,
}: {
  maintenance: MaintenanceRecord[];
  filtered: MaintenanceRecord[];
  filters: Filters;
  actions: Actions;
}) {
  return (
    <Card className="p-6 space-y-4">
      <SectionTitle
        title="Maintenance History"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-10 rounded-lg border px-3 text-sm bg-white"
              value={filters.serviceType}
              onChange={(e) => actions.setServiceType(e.target.value as any)}
            >
              <option value="ALL">All Types</option>
              <option value="OIL_CHANGE">Oil Change</option>
              <option value="TIRE_ROTATION">Tire Rotation</option>
              <option value="INSPECTION">Inspection</option>
              <option value="REPAIR">Repair</option>
            </select>

            <div className="w-40">
              <Input
                type="date"
                value={filters.fromDate}
                onChange={(e) => actions.setFromDate(e.target.value)}
              />
            </div>

            <div className="w-40">
              <Input
                type="date"
                value={filters.toDate}
                onChange={(e) => actions.setToDate(e.target.value)}
              />
            </div>

            <Button variant="secondary" onClick={actions.clear}>
              Clear
            </Button>
          </div>
        }
      />

      {maintenance.length === 0 ? (
        <EmptyState
          title="No maintenance history"
          hint="This vehicle has no maintenance records yet."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results"
          hint="No maintenance records match the selected filters."
        />
      ) : (
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />

          <div className="space-y-4">
            {filtered.map((r) => {
              const date = recordDate(r);
              const notesText = r.notes?.trim() ? r.notes.trim() : "—";

              return (
                <div key={r.id} className="relative">
                  <div className="absolute -left-[3px] top-2 h-3 w-3 rounded-full bg-white ring-2 ring-slate-300" />

                  <div className="rounded-xl border bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ServiceTypePill t={r.serviceType} />
                        <div className="text-sm font-semibold">{date}</div>
                      </div>

                      <div className="text-sm font-semibold">
                        {formatMoney(r.cost)}
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="text-slate-600">
                        Mileage at service:{" "}
                        <span className="font-medium text-slate-900">
                          {formatKm(r.mileageAtService)}
                        </span>
                      </div>

                      <div className="text-slate-600">
                        Notes:{" "}
                        <span className="font-medium text-slate-900">
                          {notesText}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {r.technician ? `Technician: ${r.technician}` : "Technician: —"}
                      {" · "}
                      Status: {r.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
