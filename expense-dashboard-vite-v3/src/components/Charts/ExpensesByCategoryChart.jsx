import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ExpensesByCategoryChart({ data }) {
  const safeData = Array.isArray(data) ? data : [];
  if (!safeData.length) return <div className="chart-placeholder muted">No category data</div>;

  const chartData = safeData.map((d) => ({ name: d?.category ?? '', value: Number(d?.total) || 0 }));

  return (
    <div className="chart-card card">
      <h3>Expenses by category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [v, 'Total']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
