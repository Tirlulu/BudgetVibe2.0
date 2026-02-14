import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Input } from '../ui/index.js';
import DynamicIcon from './DynamicIcon.jsx';
import IconPicker from './IconPicker.jsx';
import { getSeed, postSeed } from '../services/settingsService.js';

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue' },
  { value: 'orange', label: 'Orange' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'gray', label: 'Gray' },
];

const COLOR_HEX = {
  blue: '#3B82F6',
  orange: '#F97316',
  green: '#22C55E',
  red: '#EF4444',
  indigo: '#6366F1',
  gray: '#6B7280',
};

function emptyGroup() {
  return { group: '', groupEn: '', color: 'gray', items: [] };
}

function emptyItem() {
  return { name: '', nameEn: '', icon: 'Tag' };
}

export default function CategoryTemplateEditor() {
  const { t, i18n } = useTranslation();
  const [seed, setSeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [addItemGroupIdx, setAddItemGroupIdx] = useState(null);

  const isHe = i18n.language && i18n.language.startsWith('he');

  const fetchSeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSeed();
      setSeed(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || t('errors.failedToSave'));
      setSeed([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchSeed();
  }, [fetchSeed]);

  const handleSaveTemplate = async () => {
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    try {
      await postSeed(seed);
      setSaveMessage(t('settings.templateSaved'));
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(err?.message || t('errors.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  const getGroupTitle = (g) => (isHe ? (g.group || g.groupEn) : (g.groupEn || g.group));

  const updateGroup = (groupIdx, updates) => {
    setSeed((prev) => {
      const next = prev.map((g, i) => (i === groupIdx ? { ...g, ...updates } : g));
      return next;
    });
  };

  const updateItem = (groupIdx, itemIdx, updates) => {
    setSeed((prev) => {
      const next = [...prev];
      const items = [...(next[groupIdx].items || [])];
      items[itemIdx] = { ...items[itemIdx], ...updates };
      next[groupIdx] = { ...next[groupIdx], items };
      return next;
    });
  };

  const addItem = (groupIdx, item) => {
    setSeed((prev) => {
      const next = [...prev];
      const items = [...(next[groupIdx].items || []), { ...emptyItem(), ...item }];
      next[groupIdx] = { ...next[groupIdx], items };
      return next;
    });
    setAddItemGroupIdx(null);
  };

  const removeItem = (groupIdx, itemIdx) => {
    setSeed((prev) => {
      const next = [...prev];
      const items = (next[groupIdx].items || []).filter((_, i) => i !== itemIdx);
      next[groupIdx] = { ...next[groupIdx], items };
      return next;
    });
  };

  const addGroup = () => {
    setSeed((prev) => [...prev, emptyGroup()]);
  };

  const removeGroup = (groupIdx) => {
    setSeed((prev) => prev.filter((_, i) => i !== groupIdx));
  };

  if (loading) {
    return <p className="text-sm text-slate-500">{t('dataStatus.checking')}</p>;
  }

  return (
    <div className="category-template-editor space-y-6">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {saveMessage && <p className="text-sm text-emerald-600">{saveMessage}</p>}

      {seed.map((g, groupIdx) => (
        <Card key={groupIdx} className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-block h-4 w-8 rounded border border-slate-200"
              style={{ backgroundColor: COLOR_HEX[g.color] || COLOR_HEX.gray }}
              title={g.color}
            />
            <input
              type="text"
              value={isHe ? g.group : g.groupEn}
              onChange={(e) =>
                updateGroup(groupIdx, isHe ? { group: e.target.value } : { groupEn: e.target.value })
              }
              placeholder={isHe ? t('settings.groupNameHe') : t('settings.groupNameEn')}
              className="flex-1 min-w-[160px] rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
            />
            <select
              value={g.color || 'gray'}
              onChange={(e) => updateGroup(groupIdx, { color: e.target.value })}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            >
              {COLOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button type="button" variant="ghost" className="text-red-600" onClick={() => removeGroup(groupIdx)}>
              {t('categories.delete')}
            </Button>
          </div>
          <ul className="space-y-1">
            {(g.items || []).map((item, itemIdx) => (
              <li key={itemIdx} className="flex items-center gap-2 py-1">
                <DynamicIcon name={item.icon} size={18} />
                <span className="flex-1 truncate">{isHe ? item.name || item.nameEn : item.nameEn || item.name}</span>
                <button
                  type="button"
                  className="text-sm text-slate-600 hover:text-slate-900"
                  onClick={() => setEditTarget({ groupIdx, itemIdx, ...item })}
                >
                  {t('categories.edit')}
                </button>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-700"
                  onClick={() => removeItem(groupIdx, itemIdx)}
                >
                  {t('categories.delete')}
                </button>
              </li>
            ))}
          </ul>
          {addItemGroupIdx === groupIdx ? (
            <ItemForm
              onSave={(item) => addItem(groupIdx, item)}
              onCancel={() => setAddItemGroupIdx(null)}
            />
          ) : (
            <Button type="button" variant="secondary" onClick={() => setAddItemGroupIdx(groupIdx)}>
              + {t('settings.addCategoryToGroup')}
            </Button>
          )}
        </Card>
      ))}

      <Button type="button" variant="secondary" onClick={addGroup}>
        + {t('settings.addGroup')}
      </Button>

      <div className="flex items-center gap-3">
        <Button onClick={handleSaveTemplate} disabled={saving}>
          {saving ? t('editCategory.saving') : t('settings.saveTemplate')}
        </Button>
      </div>

      {editTarget && (
        <EditItemModal
          item={editTarget}
          onSave={(updates) => {
            updateItem(editTarget.groupIdx, editTarget.itemIdx, updates);
            setEditTarget(null);
          }}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}

function ItemForm({ onSave, onCancel }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [icon, setIcon] = useState('Tag');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() && !nameEn.trim()) return;
    onSave({ name: name.trim(), nameEn: nameEn.trim(), icon });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2 pt-2 border-t border-slate-100">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('settings.categoryNameHe')}
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm w-32"
      />
      <input
        type="text"
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        placeholder={t('settings.categoryNameEn')}
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm w-40"
      />
      <IconPicker value={icon} onChange={setIcon} />
      <Button type="submit" disabled={!name.trim() && !nameEn.trim()}>
        {t('categories.addCategory')}
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        {t('editCategory.cancel')}
      </Button>
    </form>
  );
}

function EditItemModal({ item, onSave, onClose }) {
  const { t } = useTranslation();
  const [name, setName] = useState(item.name ?? '');
  const [nameEn, setNameEn] = useState(item.nameEn ?? '');
  const [icon, setIcon] = useState(item.icon ?? 'Tag');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name: name.trim(), nameEn: nameEn.trim(), icon });
  };

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="popup-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{t('editCategory.title')}</h2>
          <button type="button" className="popup-close" onClick={onClose} aria-label={t('editCategory.ariaClose')}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.categoryNameHe')}</label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('settings.categoryNameHe')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.categoryNameEn')}</label>
            <Input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={t('settings.categoryNameEn')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('categories.icon')}</label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
          <div className="flex gap-2">
            <Button type="submit">{t('editCategory.save')}</Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('editCategory.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
