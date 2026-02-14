import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getStatus } from '../services/statusService.js';

const POLL_INTERVAL_MS = 45000;
const RECENT_MS = 2 * 60 * 1000;

function formatTimeAgo(isoString) {
  const date = new Date(isoString);
  const now = Date.now();
  const diffMs = now - date.getTime();
  if (diffMs < 60000) return null; // "just now" handled by "Saved"
  if (diffMs < 3600000) {
    const mins = Math.floor(diffMs / 60000);
    return mins;
  }
  const hours = Math.floor(diffMs / 3600000);
  return { hours };
}

export default function DataStatusIndicator() {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getStatus();
      setStatus(data);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchStatus]);

  useEffect(() => {
    const onFocus = () => fetchStatus();
    document.addEventListener('visibilitychange', onFocus);
    return () => document.removeEventListener('visibilitychange', onFocus);
  }, [fetchStatus]);

  if (error) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500" aria-live="polite">
        <span className="inline-block h-2 w-2 rounded-full bg-amber-400" aria-hidden />
        <span>{t('dataStatus.offline')}</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400" aria-live="polite">
        <span className="inline-block h-2 w-2 rounded-full bg-slate-300" aria-hidden />
        <span>{t('dataStatus.checking')}</span>
      </div>
    );
  }

  const { lastSync, storage } = status;
  const isRecent = lastSync && Date.now() - new Date(lastSync).getTime() < RECENT_MS;

  if (storage === 'memory') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500" aria-live="polite">
        <span className="inline-block h-2 w-2 rounded-full bg-slate-400" aria-hidden />
        <span>{t('dataStatus.inMemory')}</span>
      </div>
    );
  }

  if (isRecent || (lastSync && !storage)) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-600" aria-live="polite">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        <span>{t('dataStatus.saved')}</span>
      </div>
    );
  }

  if (lastSync) {
    const ago = formatTimeAgo(lastSync);
    const label = ago === null
      ? t('dataStatus.saved')
      : typeof ago === 'number'
        ? t('dataStatus.lastUpdatedMins', { count: ago })
        : t('dataStatus.lastUpdatedHours', { count: ago.hours });
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-600" aria-live="polite">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500" aria-live="polite">
      <span className="inline-block h-2 w-2 rounded-full bg-slate-400" aria-hidden />
      <span>{t('dataStatus.saved')}</span>
    </div>
  );
}
