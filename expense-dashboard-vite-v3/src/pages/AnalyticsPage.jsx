import React, { useState } from 'react';
import FiltersBar from '../components/FiltersBar.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import ExpensesByCategoryChart from '../components/Charts/ExpensesByCategoryChart.jsx';
import ExpensesOverTimeChart from '../components/Charts/ExpensesOverTimeChart.jsx';

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useAnalytics(filters);

  return (
    <div className="page analytics-page">
      <h1>Analytics</h1>
      <p className="muted">Overview by category, time, and card.</p>
      <FiltersBar filters={filters} onChange={setFilters} showCategory />
      {error && <p className="upload-err">{error}</p>}
      {isLoading ? (
        <p className="muted">Loading…</p>
      ) : data ? (
        <>
          <section className="charts-section">
            <ExpensesByCategoryChart data={Array.isArray(data.byCategory) ? data.byCategory : []} />
            <ExpensesOverTimeChart data={Array.isArray(data.byMonth) ? data.byMonth : []} />
          </section>
          {Array.isArray(data.byCategory) && data.byCategory.length > 0 && (
            <section className="summary-table-section">
              <h2>Summary by category</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Average</th>
                    <th>Count</th>
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
            </section>
          )}
        </>
      ) : (
        <p className="muted">No analytics data.</p>
      )}
    </div>
  );
}
