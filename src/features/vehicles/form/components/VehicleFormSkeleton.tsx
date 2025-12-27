import { Card } from "../../../../components/ui";

export default function VehicleFormSkeleton() {
  return (
    <Card className="p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-5 w-44 bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-200 rounded" />
      </div>
    </Card>
  );
}
