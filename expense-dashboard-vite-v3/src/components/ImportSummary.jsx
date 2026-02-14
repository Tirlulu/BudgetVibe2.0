import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/index.js';

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
  const { t } = useTranslation();
  const displayMessage =
    message != null
      ? message
      : needsCategoryCount > 0
        ? t('upload.messageNeedCategory', { count: needsCategoryCount })
        : t('upload.messageAllAssigned');

  return (
    <Card className="import-summary">
      <h3 className="mb-3 text-base font-semibold text-slate-800">{t('upload.importSummary')}</h3>
      <ul className="import-summary-stats">
        <li>
          <strong>{t('upload.totalTransactions')}:</strong> {totalTransactions}
        </li>
        <li>
          <strong>{t('upload.autoCategorized')}:</strong> {autoCategorizedCount}
        </li>
        <li>
          <strong>{t('upload.needCategory')}:</strong> {needsCategoryCount}
        </li>
      </ul>
      <p className={needsCategoryCount > 0 ? 'import-summary-message' : 'import-summary-message upload-ok'}>
        {displayMessage}
      </p>
    </Card>
  );
}
