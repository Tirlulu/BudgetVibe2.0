import React from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from './EmptyState.jsx';

/**
 * Generic table for fixed or variable recurring expenses.
 * rows: array of expense objects; columns: which keys to show.
 */
export default function ExpensesTable({ type, rows, columns }) {
  const { t } = useTranslation();
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeCols = Array.isArray(columns) ? columns : [];
  if (!safeRows.length) {
    return (
      <EmptyState icon="📊" message={t('empty.noRecurringExpenses')} />
    );
  }

  const labels = {
    merchant: t('expenses.merchant'),
    category: t('expenses.category'),
    amount: t('expenses.amount'),
    frequency: t('expenses.frequency'),
    card: t('expenses.creditCard'),
    lastChargeDate: t('expenses.lastCharge'),
    count: t('expenses.count'),
    averageAmount: t('expenses.avgAmount'),
    minAmount: t('expenses.min'),
    maxAmount: t('expenses.max'),
    lastAmount: t('expenses.lastAmount'),
    trend: t('expenses.trend'),
  };

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="table min-w-[600px]">
        <thead>
          <tr>
            {safeCols.map((col) => (
              <th key={col}>{labels[col] ?? col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeRows.map((row, i) => (
            <tr key={row?.merchant ?? i}>
              {safeCols.map((col) => (
                <td key={col}>{formatCell(row[col], col)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(value, col) {
  if (value == null) return '—';
  if (col === 'amount' || col === 'averageAmount' || col === 'minAmount' || col === 'maxAmount' || col === 'lastAmount' || col === 'totalAmount') {
    return typeof value === 'number' ? value.toFixed(2) : value;
  }
  if (col === 'lastChargeDate' && value) {
    const d = typeof value === 'string' ? value : value?.date;
    return d ? d.slice(0, 10) : '—';
  }
  return String(value);
}
