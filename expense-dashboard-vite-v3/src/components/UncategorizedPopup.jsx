import React, { useState, useEffect, useCallback } from 'react';
import { assignCategory } from '../services/importService.js';

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
        setError(err?.message || 'Failed to assign category');
      } finally {
        setAssigningId(null);
      }
    },
    []
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

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true" aria-labelledby="uncategorized-popup-title">
      <div className="popup uncategorized-popup">
        <div className="popup-header">
          <h2 id="uncategorized-popup-title">Categorize transactions</h2>
          <button type="button" className="popup-close" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="uncategorized-progress">
          <p className="uncategorized-progress-text">
            You have categorized <strong>{resolvedCount}</strong> out of <strong>{totalToCategorize}</strong> transactions
            (<strong>{remaining}</strong> remaining).
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
            <p className="uncategorized-almost-done">Only {remaining} left!</p>
          )}
        </div>

        {error && <p className="upload-err">{error}</p>}

        <div className="uncategorized-list-wrap">
          {remaining === 0 ? (
            <p className="muted">All done. You can close this window.</p>
          ) : (
            <ul className="uncategorized-list">
              {transactions.map((tx) => (
                <UncategorizedRow
                  key={tx?.id}
                  transaction={tx}
                  categories={categories}
                  onAssign={handleAssign}
                  isAssigning={assigningId === tx?.id}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function UncategorizedRow({ transaction, categories, onAssign, isAssigning }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const id = transaction?.id;
  const label =
    transaction?.merchantName ||
    transaction?.merchant ||
    transaction?.description ||
    transaction?.name ||
    `Transaction ${id?.slice(0, 8) || '?'}`;
  const amount = transaction?.amount ?? transaction?.amountCharge ?? transaction?.sum;
  const date = transaction?.date ?? transaction?.purchaseDate;

  function handleSubmit(e) {
    e.preventDefault();
    if (selectedCategoryId && typeof onAssign === 'function') {
      onAssign(id, selectedCategoryId);
      setSelectedCategoryId('');
    }
  }

  return (
    <li className="uncategorized-row">
      <div className="uncategorized-row-info">
        <span className="uncategorized-row-label">{label}</span>
        {amount != null && <span className="uncategorized-row-amount">{String(amount)}</span>}
        {date != null && <span className="uncategorized-row-date">{String(date)}</span>}
      </div>
      <form onSubmit={handleSubmit} className="uncategorized-row-form flex">
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          disabled={isAssigning}
          required
        >
          <option value="">Choose category…</option>
          {(categories || []).filter((c) => c?.isActive !== false).map((c) => (
            <option key={c?.id} value={c?.id}>
              {c?.name ?? c?.id}
            </option>
          ))}
        </select>
        <button type="submit" className="primary" disabled={isAssigning || !selectedCategoryId}>
          {isAssigning ? '…' : 'Assign'}
        </button>
      </form>
    </li>
  );
}
