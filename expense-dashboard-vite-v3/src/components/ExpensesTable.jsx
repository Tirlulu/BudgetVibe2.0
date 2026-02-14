import React from 'react';

/**
 * Generic table for fixed or variable recurring expenses.
 * rows: array of expense objects; columns: which keys to show.
 */

export default function ExpensesTable({ type, rows, columns }) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeCols = Array.isArray(columns) ? columns : [];
  if (!safeRows.length) {
    return <p className="muted">No recurring expenses in this period.</p>;
  }

  const labels = {
    merchant: 'Merchant',
    category: 'Category',
    amount: 'Amount',
    frequency: 'Frequency',
    card: 'Credit card',
    lastChargeDate: 'Last charge',
    count: 'Count',
    averageAmount: 'Avg amount',
    minAmount: 'Min',
    maxAmount: 'Max',
    lastAmount: 'Last amount',
    trend: 'Trend',
  };

  return (
    <table className="table">
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
