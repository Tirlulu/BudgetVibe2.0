import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExpensesOverTimeChart({ data }) {
  const safeData = Array.isArray(data) ? data : [];
  if (!safeData.length) return <div className="chart-placeholder muted">No time-series data</div>;

  return (
    <div className="chart-card card">
      <h3>Expenses over time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#9aa0a6" />
          <YAxis stroke="#9aa0a6" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
            formatter={(v) => [v, 'Total']}
          />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
