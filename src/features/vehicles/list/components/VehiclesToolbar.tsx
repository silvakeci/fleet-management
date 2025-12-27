import { Button, Input } from "../../../../components/ui";

export default function VehiclesToolbar({
  search,
  onSearchChange,
  loading,
  canCreate,
  onRefresh,
  onCreate,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
  canCreate: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-72">
        <Input
          placeholder="Search vehicles (make, model, vin, status...)"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Button variant="secondary" loading={loading} onClick={onRefresh}>
        Refresh
      </Button>

      {canCreate ? <Button onClick={onCreate}>Add Vehicle</Button> : null}
    </div>
  );
}
