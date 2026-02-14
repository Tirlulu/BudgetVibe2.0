import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import TypeBasedCategorySelect from './TypeBasedCategorySelect.jsx';
import clsx from 'clsx';

function formatDate(val) {
  if (val == null || val === '') return '—';
  const s = typeof val === 'string' ? val : (val && val.toISOString?.()) ?? '';
  return s.slice(0, 10);
}

function formatNIS(amount) {
  if (amount == null || amount === '') return '—';
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return `₪${n.toFixed(2)}`;
}

export default function ImportTable({
  transactions = [],
  categories = [],
  cardLabel,
  onAssign = () => {},
  onCreateCategory,
}) {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const displayCardLabelForRow = useCallback(
    (tx) => (cardLabel !== undefined && cardLabel !== null ? cardLabel : tx?.card ?? '—'),
    [cardLabel]
  );

  const sortedTransactions = useMemo(() => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    return [...transactions].sort((a, b) => {
      if (key === 'date') {
        const da = (a?.purchaseDate ?? a?.date ?? '').toString();
        const db = (b?.purchaseDate ?? b?.date ?? '').toString();
        return dir * (da.localeCompare(db, undefined, { numeric: true }) || 0);
      }
      if (key === 'merchant') {
        const ma = (a?.merchant ?? a?.merchantRaw ?? a?.merchantName ?? '').toString();
        const mb = (b?.merchant ?? b?.merchantRaw ?? b?.merchantName ?? '').toString();
        return dir * ma.localeCompare(mb, undefined, { sensitivity: 'base' });
      }
      if (key === 'amount') {
        const na = Number(a?.amount);
        const nb = Number(b?.amount);
        const va = Number.isNaN(na) ? 0 : na;
        const vb = Number.isNaN(nb) ? 0 : nb;
        return dir * (va - vb);
      }
      return 0;
    });
  }, [transactions, sortConfig.key, sortConfig.direction]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  const handleCategoryChange = useCallback(
    (txId, categoryId) => {
      if (categoryId) onAssign(txId, categoryId);
    },
    [onAssign]
  );

  const activeCategories = (categories || []).filter((c) => c?.isActive !== false);

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white" style={{ maxHeight: '60vh' }}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
          <tr className="text-left text-slate-600">
            <th className="whitespace-nowrap px-3 py-2.5 font-medium w-24">
              {t('categorizePage.card')}
            </th>
            <th
              className={clsx(
                'whitespace-nowrap px-3 py-2.5 font-medium cursor-pointer select-none hover:bg-slate-50',
                sortConfig.key === 'date' && 'bg-slate-50'
              )}
              onClick={() => handleSort('date')}
              role="columnheader"
              aria-sort={sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : undefined}
            >
              {t('categorizePage.date')} {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className={clsx(
                'whitespace-nowrap px-3 py-2.5 font-medium cursor-pointer select-none hover:bg-slate-50',
                sortConfig.key === 'merchant' && 'bg-slate-50'
              )}
              onClick={() => handleSort('merchant')}
              role="columnheader"
              aria-sort={sortConfig.key === 'merchant' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : undefined}
            >
              {t('categorizePage.merchant')} {sortConfig.key === 'merchant' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className={clsx(
                'whitespace-nowrap px-3 py-2.5 font-medium cursor-pointer select-none hover:bg-slate-50',
                sortConfig.key === 'amount' && 'bg-slate-50'
              )}
              onClick={() => handleSort('amount')}
              role="columnheader"
              aria-sort={sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : undefined}
            >
              {t('categorizePage.amount')} {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="whitespace-nowrap px-3 py-2.5 font-medium min-w-[220px]">
              {t('categorizePage.category')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((tx) => (
            <tr
              key={tx?.id}
              className="border-b border-slate-100 hover:bg-slate-50/50"
            >
              <td className="px-3 py-2">
                <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
                  {displayCardLabelForRow(tx)}
                </span>
              </td>
              <td className="px-3 py-2 text-slate-700">
                {formatDate(tx?.purchaseDate ?? tx?.date)}
              </td>
              <td className="px-3 py-2 text-slate-800">
                {tx?.merchant ?? tx?.merchantRaw ?? tx?.merchantName ?? '—'}
              </td>
              <td className="px-3 py-2 text-slate-700 tabular-nums">
                {formatNIS(tx?.amount)}
              </td>
              <td className="px-3 py-2 min-w-[260px]">
                <TypeBasedCategorySelect
                  categories={activeCategories}
                  value=""
                  onChange={(categoryId) => handleCategoryChange(tx?.id, categoryId)}
                  onCreate={onCreateCategory}
                  className="min-w-[240px]"
                  aria-label={`${t('categorizePage.category')} ${tx?.merchant ?? tx?.id}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sortedTransactions.length === 0 && (
        <p className="py-6 text-center text-slate-500">{t('uncategorized.allDone')}</p>
      )}
    </div>
  );
}
