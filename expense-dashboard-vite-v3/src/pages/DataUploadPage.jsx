import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { postImportCreditCard } from '../services/importService.js';
import ImportSummary from '../components/ImportSummary.jsx';
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { Card, Button } from '../ui/index.js';

export default function DataUploadPage() {
  const { t } = useTranslation();
  const [importResult, setImportResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const totalTransactions = importResult?.totalTransactions ?? 0;
  const autoCategorizedCount = importResult?.autoCategorizedCount ?? 0;
  const needsCategoryCount =
    importResult?.needsCategoryCount ?? importResult?.needsCategory?.length ?? 0;

  const handleFileChange = useCallback(
    async (e) => {
      const files = e.target.files;
      if (!files?.length) return;
      setUploadError(null);
      setImportResult(null);
      setUploading(true);
      try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        const result = await postImportCreditCard(formData);
        setImportResult(result);
        window.dispatchEvent(new CustomEvent('expenses-refresh'));
      } catch (err) {
        const message =
          err?.status === 404
            ? t('errors.importServiceUnavailable')
            : err?.message || t('errors.uploadFailed');
        setUploadError(message);
      } finally {
        setUploading(false);
        e.target.value = '';
      }
    },
    [t]
  );

  return (
    <div className="page data-upload-page">
      <PageHeader title={t('pages.upload.title')} subtitle={t('pages.upload.subtitle')} />

      <Card className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-slate-800">{t('upload.uploadFile')}</h3>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="text-slate-700"
        />
        {uploading && <p className="mt-2 text-sm text-slate-500">{t('upload.uploading')}</p>}
        {uploadError && <p className="mt-2 text-sm text-red-500">{uploadError}</p>}
      </Card>

      {!importResult && !uploading && !uploadError && (
        <EmptyState icon="📤" message={t('empty.noDataImported')} />
      )}

      {importResult && (
        <Card className="mt-6">
          <p className="upload-ok mb-4">{t('upload.success')}</p>
          <ImportSummary
            totalTransactions={totalTransactions}
            autoCategorizedCount={autoCategorizedCount}
            needsCategoryCount={needsCategoryCount}
          />
          <p className="mt-4">
            <Link to="/categorize">
              <Button>{t('dashboard.goToCategorize')}</Button>
            </Link>
          </p>
        </Card>
      )}
    </div>
  );
}
