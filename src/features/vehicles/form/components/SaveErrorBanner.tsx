import { Button, Card } from "../../../../components/ui";

export default function SaveErrorBanner({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <Card className="p-4 border-red-200 bg-red-50">
      <div className="font-semibold text-red-800">Save failed</div>
      <div className="text-sm text-red-700 mt-1">{error}</div>
      <div className="mt-3">
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </Card>
  );
}
