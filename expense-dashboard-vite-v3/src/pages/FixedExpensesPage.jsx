import React, { useState, useMemo } from 'react';
import ExpensesTable from '../components/ExpensesTable.jsx';
import FiltersBar from '../components/FiltersBar.jsx';
import { useRecurringExpenses } from '../hooks/useRecurringExpenses.js';

function mapFixedRows(items) {
  return (items || []).map((item) => {
    const lastTx = item.transactions?.[item.transactions.length - 1];
    return {
      ...item,
      amount: item.lastAmount ?? item.averageAmount,
      lastChargeDate: lastTx?.date,
      category: item.category ?? '—',
      frequency: item.frequency ?? '—',
      card: item.card ?? '—',
    };
  });
}

export default function FixedExpensesPage() {
  const [filters, setFilters] = useState({});
  const { items, isLoading, error } = useRecurringExpenses('fixed', filters);
  const rows = useMemo(() => mapFixedRows(items), [items]);

  return (
    <div className="page fixed-expenses-page">
      <h1>Fixed recurring expenses</h1>
      <p className="muted">Same merchant, same or very similar amount.</p>
      <FiltersBar filters={filters} onChange={setFilters} />
      {error && <p className="upload-err">{error}</p>}
      {isLoading ? (
        <p className="muted">Loading…</p>
      ) : (
        <ExpensesTable
          type="fixed"
          rows={rows}
          columns={['merchant', 'category', 'amount', 'frequency', 'card', 'lastChargeDate']}
        />
      )}
    </div>
  );
}
