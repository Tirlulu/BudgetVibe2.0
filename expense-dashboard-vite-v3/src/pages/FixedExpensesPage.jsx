import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ExpensesTable from '../components/ExpensesTable.jsx';
import FiltersBar from '../components/FiltersBar.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TableSkeleton from '../components/TableSkeleton.jsx';
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
  const { t } = useTranslation();
  const [filters, setFilters] = useState({});
  const { items, isLoading, error } = useRecurringExpenses('fixed', filters);
  const rows = useMemo(() => mapFixedRows(items), [items]);

  return (
    <div className="page fixed-expenses-page">
      <PageHeader title={t('pages.fixedExpenses.title')} subtitle={t('pages.fixedExpenses.subtitle')} />
      <FiltersBar filters={filters} onChange={setFilters} />
      {error && <p className="upload-err">{error}</p>}
      {isLoading ? (
        <TableSkeleton rows={8} columns={6} />
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
