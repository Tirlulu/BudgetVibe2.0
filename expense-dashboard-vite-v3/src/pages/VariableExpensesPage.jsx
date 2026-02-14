import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExpensesTable from '../components/ExpensesTable.jsx';
import FiltersBar from '../components/FiltersBar.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TableSkeleton from '../components/TableSkeleton.jsx';
import { useRecurringExpenses } from '../hooks/useRecurringExpenses.js';

export default function VariableExpensesPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({});
  const { items, isLoading, error } = useRecurringExpenses('variable', filters);
  const rows = (items || []).map((item) => ({ ...item, category: item.category ?? '—' }));

  return (
    <div className="page variable-expenses-page">
      <PageHeader title={t('pages.variableExpenses.title')} subtitle={t('pages.variableExpenses.subtitle')} />
      <FiltersBar filters={filters} onChange={setFilters} />
      {error && <p className="upload-err">{error}</p>}
      {isLoading ? (
        <TableSkeleton rows={8} columns={8} />
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
