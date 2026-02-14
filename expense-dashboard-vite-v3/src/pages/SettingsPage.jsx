import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { Card, Button } from '../ui/index.js';
import { deleteAllTransactions } from '../services/transactionsService.js';
import { postResetData } from '../services/settingsService.js';
import CategoryTemplateEditor from '../components/CategoryTemplateEditor.jsx';

const CONFIRM_TEXT = 'DELETE';

export default function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [confirmInput, setConfirmInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(null);

  const canDelete = confirmInput.trim().toUpperCase() === CONFIRM_TEXT;

  const handleDeleteAll = useCallback(async () => {
    if (!canDelete) return;
    setError(null);
    setDeleting(true);
    try {
      await deleteAllTransactions();
      window.dispatchEvent(new CustomEvent('expenses-refresh'));
      setConfirmInput('');
      navigate('/upload', { replace: true });
    } catch (err) {
      setError(err?.message || t('settings.deleteError'));
    } finally {
      setDeleting(false);
    }
  }, [canDelete, navigate, t]);

  const handleResetData = useCallback(async () => {
    if (!window.confirm(t('settings.resetDataWarning'))) return;
    setError(null);
    setResetting(true);
    try {
      await postResetData();
      window.dispatchEvent(new CustomEvent('expenses-refresh'));
      navigate('/categories', { replace: true });
    } catch (err) {
      setError(err?.message || t('settings.resetError'));
    } finally {
      setResetting(false);
    }
  }, [navigate, t]);

  return (
    <div className="page settings-page">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <Card className="mb-6">
        <h3 className="mb-2 text-base font-semibold text-slate-800">{t('settings.categoryTemplate')}</h3>
        <p className="mb-4 text-sm text-slate-600">{t('settings.categoryTemplateSubtitle')}</p>
        <CategoryTemplateEditor />
      </Card>

      <Card className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-slate-800">{t('settings.resetData')}</h3>
        <p className="mb-4 text-sm text-slate-600">{t('settings.resetDataWarning')}</p>
        <Button onClick={handleResetData} disabled={resetting}>
          {resetting ? t('settings.resetting') : t('settings.resetData')}
        </Button>
      </Card>

      <Card className="mb-6">
        <h3 className="mb-3 text-base font-semibold text-slate-800">{t('settings.admin')}</h3>
        <p className="mb-4 text-sm text-slate-600">{t('settings.deleteAllWarning')}</p>
        <div className="flex flex-col gap-3 max-w-md">
          <label htmlFor="settings-confirm-delete" className="text-sm font-medium text-slate-700">
            {t('settings.typeToConfirm', { text: CONFIRM_TEXT })}
          </label>
          <input
            id="settings-confirm-delete"
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={CONFIRM_TEXT}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            aria-describedby="settings-delete-hint"
          />
          <p id="settings-delete-hint" className="text-xs text-slate-500">
            {t('settings.deleteHint')}
          </p>
          <Button
            variant="primary"
            className="self-start bg-red-600 hover:bg-red-700 focus:ring-red-500"
            disabled={!canDelete || deleting}
            onClick={handleDeleteAll}
          >
            {deleting ? t('settings.deleting') : t('settings.deleteAllTransactions')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
