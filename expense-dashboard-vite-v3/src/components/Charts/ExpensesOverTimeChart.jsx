import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  CHART_LINE_PRIMARY,
  CHART_GRID_STROKE,
  CHART_AXIS_STROKE,
  CHART_TOOLTIP_BG,
  CHART_TOOLTIP_BORDER,
} from '../../theme/chartPalette.js';
import { Card } from '../../ui/index.js';

export default function ExpensesOverTimeChart({ data }) {
  const { t } = useTranslation();
  const safeData = Array.isArray(data) ? data : [];
  if (!safeData.length) return <div className="chart-placeholder muted">{t('analytics.noTimeSeriesData')}</div>;

  return (
    <Card className="chart-card">
      <h3 className="mb-3 text-base font-semibold text-slate-700">{t('analytics.expensesOverTime')}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} />
          <XAxis dataKey="month" stroke={CHART_AXIS_STROKE} />
          <YAxis stroke={CHART_AXIS_STROKE} />
          <Tooltip
            contentStyle={{ background: CHART_TOOLTIP_BG, border: `1px solid ${CHART_TOOLTIP_BORDER}` }}
            formatter={(v) => [v, 'Total']}
          />
          <Line type="monotone" dataKey="total" stroke={CHART_LINE_PRIMARY} strokeWidth={2} dot={{ fill: CHART_LINE_PRIMARY }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
