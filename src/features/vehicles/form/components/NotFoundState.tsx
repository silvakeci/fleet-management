import { Button, Card } from "../../../../components/ui";

export default function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vehicle not found</h1>
        <Button variant="secondary" onClick={onBack}>Back</Button>
      </div>
      <Card className="p-10 text-center">
        <div className="text-lg font-semibold">404 — Vehicle not found</div>
        <div className="text-sm text-slate-500 mt-1">
          The vehicle ID in the URL does not exist.
        </div>
      </Card>
    </div>
  );
}
