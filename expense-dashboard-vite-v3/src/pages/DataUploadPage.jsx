import React, { useState, useCallback } from 'react';
import { postImportCreditCard } from '../services/importService.js';
import { getCategories } from '../services/categoriesService.js';
import ImportSummary from '../components/ImportSummary.jsx';
import UncategorizedPopup from '../components/UncategorizedPopup.jsx';

export default function DataUploadPage() {
  const [importResult, setImportResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUncategorizedPopup, setShowUncategorizedPopup] = useState(false);
  const [categories, setCategories] = useState([]);
  const [remainingNeedsCategory, setRemainingNeedsCategory] = useState(null);
  const [remainingUncategorizedList, setRemainingUncategorizedList] = useState(null);

  const totalTransactions = importResult?.totalTransactions ?? 0;
  const autoCategorizedCount = importResult?.autoCategorizedCount ?? 0;
  const needsCategoryCount =
    remainingNeedsCategory !== null
      ? remainingNeedsCategory
      : (importResult?.needsCategoryCount ?? importResult?.needsCategory?.length ?? 0);
  const needsCategoryList = remainingUncategorizedList ?? importResult?.needsCategory ?? [];

  const handleFileChange = useCallback(async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadError(null);
    setImportResult(null);
    setRemainingNeedsCategory(null);
    setRemainingUncategorizedList(null);
    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      const result = await postImportCreditCard(formData);
      setImportResult(result);
      window.dispatchEvent(new CustomEvent('expenses-refresh'));
      const list = result?.needsCategory ?? [];
      if (list.length > 0) {
        const cats = await getCategories();
        setCategories(Array.isArray(cats) ? cats : []);
        setShowUncategorizedPopup(true);
      }
    } catch (err) {
      const message =
        err?.status === 404
          ? 'Import service not available. Make sure the backend is running (e.g. run `npm run server` in the project root).'
          : err?.message || 'Upload failed';
      setUploadError(message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, []);

  const handleClosePopup = useCallback((remainingCount, remainingList) => {
    setShowUncategorizedPopup(false);
    setRemainingNeedsCategory(remainingCount);
    setRemainingUncategorizedList(Array.isArray(remainingList) ? remainingList : null);
  }, []);

  const handleResolved = useCallback(() => {
    setRemainingNeedsCategory(0);
  }, []);

  const openCategorizePopup = useCallback(async () => {
    if (needsCategoryList.length > 0 && categories.length === 0) {
      const cats = await getCategories();
      setCategories(Array.isArray(cats) ? cats : []);
    }
    setShowUncategorizedPopup(true);
  }, [needsCategoryList.length, categories.length]);

  return (
    <div className="page data-upload-page">
      <h1>Data upload</h1>
      <p className="muted">Upload credit card statements to import transactions.</p>

      <div className="card">
        <h3>Upload file</h3>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && <p className="muted">Uploading…</p>}
        {uploadError && <p className="upload-err">{uploadError}</p>}
      </div>

      {importResult && (
        <>
          <p className="upload-ok">Upload successful.</p>
          <ImportSummary
            totalTransactions={totalTransactions}
            autoCategorizedCount={autoCategorizedCount}
            needsCategoryCount={needsCategoryCount}
          />
          {needsCategoryCount > 0 && (
            <p>
              <button type="button" className="primary" onClick={openCategorizePopup}>
                Categorize remaining ({needsCategoryCount})
              </button>
            </p>
          )}
        </>
      )}

      {showUncategorizedPopup && (
        <UncategorizedPopup
          transactions={needsCategoryList}
          categories={categories}
          onResolved={handleResolved}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
