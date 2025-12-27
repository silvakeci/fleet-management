import { Card } from "../../../components/ui";

type Tone = "neutral" | "blue" | "green" | "yellow" | "red";
type BadgeTone = "red" | "yellow" | "green" | "blue" | "gray";

export default function MetricCard({
  title,
  value,
  subtitle,
  badge,
  onClick,
  tone = "neutral",
}: {
  title: string;
  value: string;
  subtitle?: string;
  badge?: { label: string; tone: BadgeTone };
  onClick?: () => void;
  tone?: Tone;
}) {
  const toneCls =
    tone === "blue"
      ? "bg-blue-50 border-blue-200"
      : tone === "green"
      ? "bg-emerald-50 border-emerald-200"
      : tone === "yellow"
      ? "bg-amber-50 border-amber-200"
      : tone === "red"
      ? "bg-rose-50 border-rose-200"
      : "bg-white";

  const badgeCls =
    badge?.tone === "red"
      ? "bg-rose-100 text-rose-800 ring-1 ring-rose-200"
      : badge?.tone === "yellow"
      ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200"
      : badge?.tone === "green"
      ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"
      : badge?.tone === "blue"
      ? "bg-blue-100 text-blue-900 ring-1 ring-blue-200"
      : "bg-slate-100 text-slate-800 ring-1 ring-slate-200";

  return (
    <Card
      className={`p-5 transition ${toneCls} ${onClick ? "cursor-pointer hover:shadow-sm" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-600">{title}</div>
          <div className="text-2xl font-semibold tracking-tight mt-1">{value}</div>
          {subtitle ? <div className="text-xs text-slate-500 mt-1">{subtitle}</div> : null}
        </div>

        {badge ? (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeCls}`}>
            {badge.label}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
