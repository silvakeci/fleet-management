import { Card } from "../../../components/ui";

type Tone = "default" | "green" | "yellow" | "blue" | "red";

type Badge = {
  label: string;
  tone?: Tone;
};

type Props = {
  title: string;
  value: number | string | null | undefined;
  subtitle?: string;
  tone?: Tone;
  badge?: Badge;
  onClick?: () => void;
};

function toneClasses(tone: Tone) {
  switch (tone) {
    case "green":
      return "bg-emerald-50 border-emerald-200";
    case "yellow":
      return "bg-amber-50 border-amber-200";
    case "blue":
      return "bg-sky-50 border-sky-200";
    case "red":
      return "bg-rose-50 border-rose-200";
    default:
      return "bg-white border-slate-200";
  }
}

function badgeClasses(tone: Tone) {
  switch (tone) {
    case "green":
      return "bg-emerald-100 text-emerald-900 ring-emerald-200";
    case "yellow":
      return "bg-amber-100 text-amber-950 ring-amber-200";
    case "blue":
      return "bg-sky-100 text-sky-950 ring-sky-200";
    case "red":
      return "bg-rose-100 text-rose-950 ring-rose-200";
    default:
      return "bg-slate-100 text-slate-900 ring-slate-200";
  }
}

function formatValue(value: Props["value"]) {
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string") return value;
  return "0";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  tone = "default",
  badge,
  onClick,
}: Props) {
  const clickable = Boolean(onClick);

  return (
    <Card
      className={[
        "p-5 transition",
        toneClasses(tone),
        clickable ? "cursor-pointer hover:shadow-sm" : "",
      ].join(" ")}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-slate-500">{title}</div>

          <div className="text-2xl font-semibold mt-1 truncate">
            {formatValue(value)}
          </div>

          {subtitle ? (
            <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
          ) : null}
        </div>

        {badge ? (
          <span
            className={[
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1",
              badgeClasses(badge.tone ?? "default"),
            ].join(" ")}
          >
            {badge.label}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
