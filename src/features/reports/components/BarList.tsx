export default function BarList({
    title,
    items,
    maxItems = 12,
    valueFormatter = (n) => String(n),
  }: {
    title: string;
    items: { key: string; value: number }[];
    maxItems?: number;
    valueFormatter?: (n: number) => string;
  }) {
    const top = items.slice(0, maxItems);
    const max = Math.max(1, ...top.map((x) => x.value));
  
    return (
      <div className="rounded-2xl border bg-white p-5">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-4 space-y-3">
          {top.map((x) => (
            <div key={x.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{x.key}</span>
                <span className="font-semibold">{valueFormatter(x.value)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-900/80"
                  style={{ width: `${Math.round((x.value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {items.length === 0 ? (
            <div className="text-sm text-slate-500">No data.</div>
          ) : null}
        </div>
      </div>
    );
  }
  