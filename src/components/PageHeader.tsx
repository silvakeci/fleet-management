export default function PageHeader({
    title,
    subtitle,
    right,
  }: {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {right && <div className="sm:pt-1">{right}</div>}
      </div>
    );
  }
  