"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export type RenewableSlice = {
  name: string;
  value: number;
};

interface TopRenewablesPieChartProps {
  data?: RenewableSlice[];
}

const DEFAULT_DATA: RenewableSlice[] = [
  { name: "Solar", value: 60 },
  { name: "Wind", value: 40 },
];

const COLORS = ["#FC7019", "#1F3A5F", "#FDBA74", "#4ADE80"];

const TopRenewablesPieChart = ({ data }: TopRenewablesPieChartProps) => {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;

  return (
    <div className="rounded-3xl border border-[#F2D8C3] bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-gray-900">
        Top Renewable Energy Mix
      </h3>
      <p className="mb-4 text-xs text-gray-600">
        This chart visualizes the relative strength of each renewable resource
        for the selected province based on available potential and resource
        quality.
      </p>

      <div className="h-52 w-full md:h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-[11px] text-gray-500">
        Use this as a quick visual reference when discussing IslaGrid sizing,
        phasing, and benefits with your stakeholders.
      </p>
    </div>
  );
};

export default TopRenewablesPieChart;
