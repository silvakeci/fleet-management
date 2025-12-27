import { Button, Card } from "../../../../components/ui";
import type { Vehicle } from "../../../../types/vehicle";

export function VehiclesLoading() {
  return (
    <Card className="p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded" />
      </div>
    </Card>
  );
}

export function VehiclesError({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <Card className="p-6 border-red-200 bg-red-50">
      <div className="font-semibold text-red-800">Error loading vehicles</div>
      <div className="text-sm text-red-700 mt-1">{error}</div>
      <div className="mt-4">
        <Button onClick={onRetry}>Try again</Button>
      </div>
    </Card>
  );
}

export function VehiclesEmpty({
  canCreate,
  onCreate,
}: {
  canCreate: boolean;
  onCreate: () => void;
}) {
  return (
    <Card className="p-10 text-center">
      <div className="text-lg font-semibold">No vehicles yet</div>
      <div className="text-sm text-slate-500 mt-1">
        Once vehicles are added, they will show up here.
      </div>
      {canCreate ? (
        <div className="mt-4">
          <Button onClick={onCreate}>Add your first vehicle</Button>
        </div>
      ) : null}
    </Card>
  );
}

export function VehiclesNoResults({
  canCreate,
  onCreate,
  onClear,
}: {
  canCreate: boolean;
  onCreate: () => void;
  onClear: () => void;
}) {
  return (
    <Card className="p-10 text-center">
      <div className="text-lg font-semibold">No results</div>
      <div className="text-sm text-slate-500 mt-1">
        Try a different search term.
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <Button variant="secondary" onClick={onClear}>
          Clear search
        </Button>
        {canCreate ? <Button onClick={onCreate}>Add Vehicle</Button> : null}
      </div>
    </Card>
  );
}

export function shouldShowEmpty(status: string, items: Vehicle[]) {
  return status === "succeeded" && items.length === 0;
}

export function shouldShowNoResults(status: string, items: Vehicle[], filtered: Vehicle[]) {
  return status === "succeeded" && items.length > 0 && filtered.length === 0;
}

export function shouldShowTable(status: string, filtered: Vehicle[]) {
  return status === "succeeded" && filtered.length > 0;
}
