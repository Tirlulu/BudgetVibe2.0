import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { assignCategory } from '../services/importService.js';
import ImportTable from './ImportTable.jsx';

/**
 * Modal to categorize uncategorized transactions. Tracks progress (resolvedCount, remaining)
 * and removes each transaction from the list when successfully categorized.
 * Calls onResolved() when remaining reaches 0 and onClose(remainingCount) when the popup is closed.
 */
export default function UncategorizedPopup({
  transactions: initialTransactions = [],
  categories = [],
  onResolved,
  onClose,
}) {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState(() => [...(initialTransactions || [])]);
  const [assigningId, setAssigningId] = useState(null);
  const [error, setError] = useState(null);

  const totalToCategorize = initialTransactions?.length ?? 0;
  const remaining = transactions.length;
  const resolvedCount = totalToCategorize - remaining;

  // Reset local list when initial transactions change (e.g. popup reopened)
  useEffect(() => {
    setTransactions([...(initialTransactions || [])]);
    setError(null);
  }, [initialTransactions]);

  const handleAssign = useCallback(
    async (transactionId, categoryId) => {
      if (!transactionId || !categoryId) return;
      setAssigningId(transactionId);
      setError(null);
      try {
        await assignCategory(transactionId, categoryId);
        setTransactions((prev) => prev.filter((t) => t?.id !== transactionId));
      } catch (err) {
        setError(err?.message || t('errors.failedToAssign'));
      } finally {
        setAssigningId(null);
      }
    },
    [t],
  );

  const handleClose = useCallback(() => {
    if (typeof onClose === 'function') onClose(remaining, transactions);
  }, [onClose, remaining, transactions]);

  // When remaining hits 0, notify parent and close
  useEffect(() => {
    if (remaining === 0 && totalToCategorize > 0) {
      if (typeof onResolved === 'function') onResolved();
      if (typeof onClose === 'function') onClose(0);
    }
  }, [remaining, totalToCategorize, onResolved, onClose]);

  const isAlmostDone = remaining > 0 && remaining <= 3;

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  return (
    <div
      className="popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="uncategorized-popup-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="popup uncategorized-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 id="uncategorized-popup-title">{t('uncategorized.title')}</h2>
          <button type="button" className="popup-close" onClick={handleClose} aria-label={t('uncategorized.ariaClose')}>
            ×
          </button>
        </div>

        <div className="uncategorized-progress">
          <p className="uncategorized-progress-text">
            {t('uncategorized.progress', { resolved: resolvedCount, total: totalToCategorize, remaining })}
          </p>
          {totalToCategorize > 0 && (
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${totalToCategorize ? (resolvedCount / totalToCategorize) * 100 : 0}%` }}
              />
            </div>
          )}
          {isAlmostDone && (
            <p className="uncategorized-almost-done">{t('uncategorized.onlyLeft', { count: remaining })}</p>
          )}
        </div>

        {error && <p className="upload-err">{error}</p>}

        <div className="uncategorized-list-wrap mt-3">
          <ImportTable
            transactions={transactions}
            categories={categories}
            onAssign={handleAssign}
            assigningId={assigningId}
          />
        </div>
      </div>
    </div>
  );
}
