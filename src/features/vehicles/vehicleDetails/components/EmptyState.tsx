import { Card } from "../../../../components/ui";

export default function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <Card className="p-8 text-center">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{hint}</div>
    </Card>
  );
}
