import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TEAL = "#0d9488";
const AXIS = "#6b7280";
const GRID = "#eef0f3";

interface Datum {
  name: string;
  count: number;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Datum }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border bg-white px-3 py-2 text-xs shadow-md">
      <div className="font-medium text-foreground">{d.name}</div>
      <div className="text-muted-foreground">
        {d.count} {d.count === 1 ? "opportunity" : "opportunities"}
      </div>
    </div>
  );
}

export function ChartCard({
  title,
  description,
  data,
  layout,
}: {
  title: string;
  description: string;
  data: Datum[];
  layout: "horizontal" | "vertical";
}) {
  const horizontalBars = layout === "horizontal";
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {horizontalBars ? (
              <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 8 }} barCategoryGap={10}>
                <CartesianGrid horizontal={false} stroke={GRID} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={118} tick={{ fontSize: 12, fill: AXIS }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(13,148,136,0.06)" }} />
                <Bar dataKey="count" fill={TEAL} radius={[0, 4, 4, 0]} maxBarSize={22}>
                  <LabelList dataKey="count" position="right" style={{ fontSize: 12, fill: "#374151", fontWeight: 500 }} />
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={data} margin={{ top: 20, right: 8, bottom: 4, left: -16 }} barCategoryGap={10}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="name" interval={0} tick={{ fontSize: 11, fill: AXIS }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(13,148,136,0.06)" }} />
                <Bar dataKey="count" fill={TEAL} radius={[4, 4, 0, 0]} maxBarSize={36}>
                  <LabelList dataKey="count" position="top" style={{ fontSize: 12, fill: "#374151", fontWeight: 500 }} />
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
