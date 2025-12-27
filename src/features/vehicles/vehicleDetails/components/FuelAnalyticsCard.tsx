import { Card } from "../../../../components/ui";
import SectionTitle from "./SectionTitle";

export default function FuelAnalyticsCard({
  analytics,
}: {
  analytics:
    | null
    | {
        currentMileage: number;
        avgFuelConsumption: number;
        totalFuelCost: number;
        costs: Array<{ m: string; v: number }>;
        max: number;
      };
}) {
  return (
    <Card className="p-6 space-y-4">
      <SectionTitle title="Fuel & Mileage Analytics" />
      {analytics ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border p-4">
            <div className="text-xs text-slate-500">Current Mileage</div>
            <div className="text-2xl font-semibold mt-1">{analytics.currentMileage.toLocaleString()} km</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="text-xs text-slate-500">Avg Fuel Consumption</div>
            <div className="text-2xl font-semibold mt-1">{analytics.avgFuelConsumption} L/100km</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="text-xs text-slate-500">Total Fuel Costs</div>
            <div className="text-2xl font-semibold mt-1">€ {analytics.totalFuelCost.toLocaleString()}</div>
          </div>

          <div className="lg:col-span-3 rounded-xl border p-4">
            <div className="text-sm font-semibold">Fuel cost trend (last 6 months)</div>
            <div className="mt-3 flex items-end gap-3 h-32">
              {analytics.costs.map((c) => (
                <div key={c.m} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-lg bg-slate-900/80"
                    style={{ height: `${Math.round((c.v / analytics.max) * 100)}%` }}
                    title={`€ ${c.v}`}
                  />
                  <div className="text-xs text-slate-500">{c.m}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-500">No analytics available.</div>
      )}
    </Card>
  );
}
