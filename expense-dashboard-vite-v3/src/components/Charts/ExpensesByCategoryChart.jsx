import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CHART_COLORS } from '../../theme/chartPalette.js';
import { Card } from '../../ui/index.js';

export default function ExpensesByCategoryChart({ data }) {
  const { t } = useTranslation();
  const safeData = Array.isArray(data) ? data : [];
  if (!safeData.length) return <div className="chart-placeholder muted">{t('analytics.noCategoryData')}</div>;

  const chartData = safeData.map((d) => ({ name: d?.category ?? '', value: Number(d?.total) || 0 }));

  return (
    <Card className="chart-card">
      <h3 className="mb-3 text-base font-semibold text-slate-700">{t('analytics.expensesByCategory')}</h3>
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
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [v, 'Total']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
