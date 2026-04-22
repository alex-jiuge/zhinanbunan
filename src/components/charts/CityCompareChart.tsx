'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CityCompareChartProps {
  data: Record<string, number[]>;
  dimensions: string[];
  className?: string;
}

export function CityCompareChart({ data, dimensions, className }: CityCompareChartProps) {
  const chartData = Object.entries(data).map(([city, scores]) => {
    const entry: Record<string, string | number> = { name: city };
    scores.forEach((score, index) => {
      entry[dimensions[index]] = score;
    });
    return entry;
  });

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Legend />
          {dimensions.map((dim, index) => (
            <Bar key={index} dataKey={dim} fill={`hsl(var(--primary))`} opacity={1 - index * 0.15} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
