import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FiltersBar from '../components/FiltersBar.jsx';
import PageHeader from '../components/PageHeader.jsx';
import CardSkeleton from '../components/CardSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import ExpensesByCategoryChart from '../components/Charts/ExpensesByCategoryChart.jsx';
import ExpensesOverTimeChart from '../components/Charts/ExpensesOverTimeChart.jsx';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useAnalytics(filters);

  return (
    <div className="page analytics-page">
      <PageHeader title={t('pages.analytics.title')} subtitle={t('pages.analytics.subtitle')} />
      <FiltersBar filters={filters} onChange={setFilters} showCategory />
      {error && <p className="upload-err">{error}</p>}
      {isLoading ? (
        <section className="charts-section">
          <CardSkeleton />
          <CardSkeleton />
        </section>
      ) : data ? (
        <>
          <section className="charts-section">
            <ExpensesByCategoryChart data={Array.isArray(data.byCategory) ? data.byCategory : []} />
            <ExpensesOverTimeChart data={Array.isArray(data.byMonth) ? data.byMonth : []} />
          </section>
          {Array.isArray(data.byCategory) && data.byCategory.length > 0 && (
            <section className="summary-table-section mt-6">
              <h2 className="mb-3 text-lg font-semibold text-slate-700">{t('analytics.summaryByCategory')}</h2>
              <div className="overflow-x-auto -mx-1">
                <table className="table min-w-[400px]">
                <thead>
                  <tr>
                    <th>{t('expenses.category')}</th>
                    <th>{t('analytics.total')}</th>
                    <th>{t('analytics.average')}</th>
                    <th>{t('analytics.count')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byCategory.map((row, i) => (
                    <tr key={i}>
                      <td>{row.category}</td>
                      <td>{row.total}</td>
                      <td>{row.average}</td>
                      <td>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : (
        <EmptyState icon="📈" message={t('empty.noAnalyticsData')} />
      )}
    </div>
  );
}
