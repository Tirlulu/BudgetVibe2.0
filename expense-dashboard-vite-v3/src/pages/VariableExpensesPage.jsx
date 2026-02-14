import React, { useState } from 'react';
import ExpensesTable from '../components/ExpensesTable.jsx';
import FiltersBar from '../components/FiltersBar.jsx';
import { useRecurringExpenses } from '../hooks/useRecurringExpenses.js';

export default function VariableExpensesPage() {
  const [filters, setFilters] = useState({});
  const { items, isLoading, error } = useRecurringExpenses('variable', filters);
  const rows = (items || []).map((item) => ({ ...item, category: item.category ?? '—' }));

  return (
    <div className="page variable-expenses-page">
      <h1>Variable recurring expenses</h1>
      <p className="muted">Same merchant, different amounts over time.</p>
      <FiltersBar filters={filters} onChange={setFilters} />
      {error && <p className="upload-err">{error}</p>}
      {isLoading ? (
        <p className="muted">Loading…</p>
      ) : (
        <ExpensesTable
          type="variable"
          rows={rows}
          columns={['merchant', 'category', 'count', 'averageAmount', 'minAmount', 'maxAmount', 'lastAmount', 'trend']}
        />
      )}
    </div>
  );
}
