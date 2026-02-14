import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import TableSkeleton from '../components/TableSkeleton.jsx';
import ImportTable from '../components/ImportTable.jsx';
import { Card, Button } from '../ui/index.js';
import { getTransactions, updateTransactionCategory } from '../services/transactionsService.js';
import { useCategories } from '../hooks/useCategories.js';

const LIMIT = 500;

export default function UncategorizedPage() {
  const { t } = useTranslation();
  const { options: categories, createCategory, refresh: refreshCategories } = useCategories();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const txRes = await getTransactions({ uncategorized: 'true', limit: LIMIT });
      setTransactions(Array.isArray(txRes?.transactions) ? txRes.transactions : []);
      setTotal(Number(txRes?.total) ?? 0);
    } catch (err) {
      setError(err?.message || t('errors.failedToAssign'));
      setTransactions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = useCallback(
    async (txId, categoryId) => {
      if (!categoryId) return;
      setError(null);
      try {
        await updateTransactionCategory(txId, categoryId);
        setTransactions((prev) => prev.filter((tx) => tx.id !== txId));
        setTotal((n) => Math.max(0, n - 1));
      } catch (err) {
        setError(err?.message || t('errors.failedToAssign'));
      }
    },
    [t]
  );

  const handleCreateCategory = useCallback(
    async (payload) => {
      const created = await createCategory(payload);
      await refreshCategories();
      return created;
    },
    [createCategory, refreshCategories]
  );

  const byCard = useMemo(() => {
    const m = new Map();
    for (const tx of transactions) {
      const k = tx?.card ?? '';
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(tx);
    }
    const keys = [...m.keys()].sort();
    return keys.map((cardLabel) => ({
      cardLabel: cardLabel || t('categorizePage.otherCard', 'Other'),
      transactions: m.get(cardLabel),
    }));
  }, [transactions, t]);

  return (
    <div className="page uncategorized-page categorize-page">
      <PageHeader title={t('pages.categorize.title')} subtitle={t('pages.categorize.subtitle')} />

      {error && <p className="upload-err mb-4">{error}</p>}

      {loading ? (
        <TableSkeleton rows={10} columns={5} />
      ) : transactions.length === 0 ? (
        <Card className="p-6">
          <p className="mb-4 text-lg font-medium text-slate-800">{t('categorizePage.allCaughtUp')}</p>
          <p className="mb-4 text-sm text-slate-600">{t('categorizePage.noUncategorized')}</p>
          <Link to="/">
            <Button>{t('dashboard.backToDashboard')}</Button>
          </Link>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-600">
            {t('categorizePage.remaining', { count: total })}
          </p>

          {byCard.map(({ cardLabel, transactions: cardTransactions }) => (
            <div key={cardLabel} className="mb-8">
              <h2 className="text-base font-semibold text-slate-800 mb-3">
                💳 {cardLabel}
              </h2>
              <ImportTable
                transactions={cardTransactions}
                categories={categories}
                cardLabel={cardLabel}
                onAssign={handleAssign}
                onCreateCategory={handleCreateCategory}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
