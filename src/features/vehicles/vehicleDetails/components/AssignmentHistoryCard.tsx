import { Card } from "../../../../components/ui";
import SectionTitle from "./SectionTitle";
import EmptyState from "./EmptyState";
import type { DriverAssignmentHistoryItem } from "../../../../types/driver";

export default function AssignmentHistoryCard({
  assignments,
}: {
  assignments: DriverAssignmentHistoryItem[];
}) {
  return (
    <Card className="p-6 space-y-4">
      <SectionTitle title="Assignment History" />

      {assignments.length === 0 ? (
        <EmptyState
          title="No assignment history"
          hint="This vehicle has not been assigned to any driver yet."
        />
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => {
            const isCurrent = !a.to;
            return (
              <div
                key={a.id}
                className={`rounded-xl border p-4 flex items-center justify-between gap-3 ${
                  isCurrent ? "bg-blue-50 border-blue-200" : "bg-white"
                }`}
              >
                <div>
                  <div className="font-semibold">{a.vehicleLabel}</div>
                  <div className="text-sm text-slate-500">
                    {a.from} → {a.to ?? "Present"}
                  </div>
                </div>

                {isCurrent ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 ring-1 ring-blue-200">
                    Current
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
