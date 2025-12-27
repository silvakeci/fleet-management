export default function ActivityRow({
    primary,
    secondary,
    right,
    onClick,
  }: {
    primary: string;
    secondary: string;
    right?: string;
    onClick?: () => void;
  }) {
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-xl border p-4 bg-white ${
          onClick ? "cursor-pointer hover:bg-slate-50" : ""
        }`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
      >
        <div>
          <div className="font-semibold">{primary}</div>
          <div className="text-sm text-slate-500">{secondary}</div>
        </div>
        {right ? <div className="text-sm font-semibold text-slate-700">{right}</div> : null}
      </div>
    );
  }
  