import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getDashboardStats } from '../services/dashboardService.js';
import PageHeader from '../components/PageHeader.jsx';
import { Card, Button } from '../ui/index.js';
import { CHART_COLORS } from '../theme/chartPalette.js';

function formatNIS(value) {
  if (value == null || typeof value !== 'number' || isNaN(value)) return '₪0';
  return `₪${Number(value).toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err?.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const onFocus = () => fetchStats();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="page dashboard-page">
        <PageHeader title={t('pages.dashboard.title')} subtitle={t('pages.dashboard.subtitle')} />
        <p className="text-slate-500">{t('common.loading')}</p>
      </div>
    );
  }

  const total = stats?.total ?? 0;
  const fixed = stats?.fixed ?? 0;
  const variable = stats?.variable ?? 0;
  const uncategorizedCount = stats?.uncategorizedCount ?? 0;
  const fixedPercent = stats?.fixedPercent ?? 0;

  const pieData = [
    { name: t('dashboard.fixed'), value: fixed, color: CHART_COLORS[0] },
    { name: t('dashboard.variable'), value: variable, color: CHART_COLORS[1] },
  ].filter((d) => d.value > 0);

  return (
    <div className="page dashboard-page">
      <PageHeader title={t('pages.dashboard.title')} subtitle={t('pages.dashboard.subtitle')} />

      {error && <p className="upload-err mb-4">{error}</p>}

      {uncategorizedCount > 0 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-800">
            {t('dashboard.uncategorizedAlert', { count: uncategorizedCount })}
          </p>
          <Link to="/categorize" className="mt-2 inline-block">
            <Button>{t('dashboard.goToCategorize')}</Button>
          </Link>
        </div>
      )}

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 bg-white p-4">
          <h3 className="text-sm font-medium text-slate-500">{t('dashboard.total')}</h3>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{formatNIS(total)}</p>
        </Card>
        <Card className="border-slate-200 bg-white p-4">
          <h3 className="text-sm font-medium text-slate-500">{t('dashboard.fixed')}</h3>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{formatNIS(fixed)}</p>
          {total > 0 && (
            <p className="mt-0.5 text-sm text-slate-500">{fixedPercent}% {t('dashboard.ofTotal')}</p>
          )}
        </Card>
        <Card className="border-slate-200 bg-white p-4">
          <h3 className="text-sm font-medium text-slate-500">{t('dashboard.variable')}</h3>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{formatNIS(variable)}</p>
        </Card>
      </section>

      {pieData.length > 0 && (
        <Card className="chart-card p-4">
          <h3 className="mb-3 text-base font-semibold text-slate-700">{t('dashboard.fixedVsVariable')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [formatNIS(v), '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {!loading && total === 0 && pieData.length === 0 && (
        <p className="text-slate-500">{t('dashboard.noData')}</p>
      )}
    </div>
  );
}
