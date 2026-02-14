import React from 'react';

/**
 * Displays upload result: totalTransactions, autoCategorizedCount, needsCategoryCount,
 * and a clear message about how many transactions still need a category.
 */
export default function ImportSummary({
  totalTransactions = 0,
  autoCategorizedCount = 0,
  needsCategoryCount = 0,
  message,
}) {
  const displayMessage =
    message != null
      ? message
      : needsCategoryCount > 0
        ? `There are ${needsCategoryCount} transaction${needsCategoryCount === 1 ? '' : 's'} that still need a category.`
        : 'All transactions have been assigned a category.';

  return (
    <div className="card import-summary">
      <h3>Import summary</h3>
      <ul className="import-summary-stats">
        <li>
          <strong>Total transactions:</strong> {totalTransactions}
        </li>
        <li>
          <strong>Auto-categorized:</strong> {autoCategorizedCount}
        </li>
        <li>
          <strong>Need category:</strong> {needsCategoryCount}
        </li>
      </ul>
      <p className={needsCategoryCount > 0 ? 'import-summary-message' : 'import-summary-message upload-ok'}>
        {displayMessage}
      </p>
    </div>
  );
}
