import type { ScheduleFilter } from "../selectors";

export default function MaintenanceFilters({
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
}: {
  filter: ScheduleFilter;
  sortBy: "DATE" | "VEHICLE";
  onFilterChange: (v: ScheduleFilter) => void;
  onSortChange: (v: "DATE" | "VEHICLE") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select className="h-10 rounded-lg border px-3 text-sm bg-white" value={filter} onChange={(e) => onFilterChange(e.target.value as any)}>
        <option value="ALL">All</option>
        <option value="THIS_WEEK">This week</option>
        <option value="THIS_MONTH">This month</option>
        <option value="OVERDUE">Overdue</option>
      </select>

      <select className="h-10 rounded-lg border px-3 text-sm bg-white" value={sortBy} onChange={(e) => onSortChange(e.target.value as any)}>
        <option value="DATE">Sort by date</option>
        <option value="VEHICLE">Sort by vehicle</option>
      </select>
    </div>
  );
}
