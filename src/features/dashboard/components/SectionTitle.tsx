export default function SectionTitle({
    title,
    right,
  }: {
    title: string;
    right?: React.ReactNode;
  }) {
    return (
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {right}
      </div>
    );
  }
  