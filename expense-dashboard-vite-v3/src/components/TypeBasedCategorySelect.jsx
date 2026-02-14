import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Combobox } from '@headlessui/react';
import { ChevronDown, Plus } from 'lucide-react';
import clsx from 'clsx';
import { Button, Input } from '../ui/index.js';
import DynamicIcon from './DynamicIcon.jsx';

/**
 * Terminology (Type vs Group vs Category name):
 * - Expense type (סוג הוצאה): Fixed vs Variable. category.isFixed.
 * - Group (קבוצה): Label that clusters categories (e.g. "דיור ומיסים"). category.group.
 * - Category name (שם קטגוריה): The category label (e.g. "משכנתא"). category.name.
 */
const ADD_PREFIX = '__add__';
const NEW_GROUP_VALUE = '__newgroup__';

export default function TypeBasedCategorySelect({
  value = '',
  categories = [],
  onChange,
  onCreate,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}) {
  const { t } = useTranslation();
  const list = Array.isArray(categories) ? categories : [];

  const selectedCategory = useMemo(
    () => list.find((c) => c?.id === value) ?? null,
    [list, value]
  );

  const [selectedType, setSelectedType] = useState(true);
  const [query, setQuery] = useState('');
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickCreateGroup, setQuickCreateGroup] = useState('');
  const [quickCreateName, setQuickCreateName] = useState('');
  const [quickCreateSaving, setQuickCreateSaving] = useState(false);
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupFirstCategoryName, setNewGroupFirstCategoryName] = useState('');
  const [newGroupSaving, setNewGroupSaving] = useState(false);

  useEffect(() => {
    if (value && selectedCategory) {
      setSelectedType(selectedCategory.isFixed === true);
    }
  }, [value, selectedCategory?.id, selectedCategory?.isFixed]);

  const filteredByType = useMemo(
    () => list.filter((c) => c?.isFixed === selectedType),
    [list, selectedType]
  );

  const grouped = useMemo(() => {
    const order = [];
    const byGroup = new Map();
    for (const c of filteredByType) {
      const g = c?.group ?? '';
      if (!byGroup.has(g)) {
        order.push(g);
        byGroup.set(g, []);
      }
      byGroup.get(g).push(c);
    }
    order.sort((a, b) => (a || '').localeCompare(b || '', undefined, { sensitivity: 'base' }));
    return order.map((groupName) => {
      const rawItems = (byGroup.get(groupName) || []).filter(
        (c) => !query || (c?.name ?? '').toLowerCase().includes(query.trim().toLowerCase())
      );
      const items = [...rawItems].sort((a, b) => (b?.usageCount ?? 0) - (a?.usageCount ?? 0));
      return { groupName, items };
    }).filter((g) => g.items.length > 0 || !query);
  }, [filteredByType, query]);

  const handleComboboxChange = useCallback(
    (id) => {
      if (id === NEW_GROUP_VALUE) {
        setNewGroupName('');
        setNewGroupFirstCategoryName('');
        setShowNewGroupForm(true);
        return;
      }
      if (typeof id === 'string' && id.startsWith(ADD_PREFIX)) {
        const group = id.slice(ADD_PREFIX.length);
        setQuickCreateGroup(group);
        setQuickCreateName('');
        setShowQuickCreate(true);
        return;
      }
      setQuery('');
      onChange(id || '');
    },
    [onChange]
  );

  const handleTypeClick = useCallback(
    (isFixed) => {
      setSelectedType(isFixed);
      onChange('');
      setQuery('');
    },
    [onChange]
  );

  const handleQuickCreateSave = useCallback(async () => {
    const name = quickCreateName?.trim();
    if (!name || typeof onCreate !== 'function') return;
    setQuickCreateSaving(true);
    try {
      const created = await onCreate({
        name,
        group: quickCreateGroup,
        isFixed: selectedType,
      });
      if (created?.id) {
        onChange(created.id);
      }
      setShowQuickCreate(false);
      setQuickCreateName('');
      setQuickCreateGroup('');
    } catch (err) {
      // leave form open; parent may show error
    } finally {
      setQuickCreateSaving(false);
    }
  }, [onCreate, quickCreateName, quickCreateGroup, selectedType, onChange]);

  const handleQuickCreateCancel = useCallback(() => {
    setShowQuickCreate(false);
    setQuickCreateName('');
    setQuickCreateGroup('');
  }, []);

  const handleNewGroupSave = useCallback(async () => {
    const group = newGroupName?.trim();
    const name = newGroupFirstCategoryName?.trim();
    if (!group || !name || typeof onCreate !== 'function') return;
    setNewGroupSaving(true);
    try {
      const created = await onCreate({
        name,
        group,
        isFixed: selectedType,
      });
      if (created?.id) {
        onChange(created.id);
      }
      setShowNewGroupForm(false);
      setNewGroupName('');
      setNewGroupFirstCategoryName('');
    } catch (err) {
      // leave form open; parent may show error
    } finally {
      setNewGroupSaving(false);
    }
  }, [onCreate, newGroupName, newGroupFirstCategoryName, selectedType, onChange]);

  const handleNewGroupCancel = useCallback(() => {
    setShowNewGroupForm(false);
    setNewGroupName('');
    setNewGroupFirstCategoryName('');
  }, []);

  const displayValue = selectedCategory ? selectedCategory.name : '';
  const inputDisplayValue = query || displayValue;
  const hasCreate = typeof onCreate === 'function';

  return (
    <div className={clsx('space-y-2', className)} role="group" aria-label={ariaLabel ?? t('categorizePage.category')}>
      <div>
        <span className="block text-xs font-medium text-slate-500 mb-1">
          {t('categorizePage.expenseTypeLabel')}
        </span>
        <div className="flex rounded-lg overflow-hidden gap-0">
          <button
            type="button"
            onClick={() => handleTypeClick(true)}
            disabled={disabled}
            className={clsx(
              'flex-1 px-3 py-2 text-sm font-medium',
              selectedType
                ? 'bg-primary-700 text-white font-bold ring-2 ring-primary-400 shadow-inner'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
            )}
          >
            {t('categorizePage.expenseTypeFixed', 'Fixed')}
          </button>
          <button
            type="button"
            onClick={() => handleTypeClick(false)}
            disabled={disabled}
            className={clsx(
              'flex-1 px-3 py-2 text-sm font-medium',
              !selectedType
                ? 'bg-primary-700 text-white font-bold ring-2 ring-primary-400 shadow-inner'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
            )}
          >
            {t('categorizePage.expenseTypeVariable', 'Variable')}
          </button>
        </div>
      </div>

      {showNewGroupForm ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {t('categorizePage.newGroupName')}
          </label>
          <Input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder={t('categorizePage.newGroupName')}
            className="bg-white"
            autoFocus
          />
          <label className="block text-sm font-medium text-slate-700">
            {t('categorizePage.firstCategoryName')}
          </label>
          <Input
            type="text"
            value={newGroupFirstCategoryName}
            onChange={(e) => setNewGroupFirstCategoryName(e.target.value)}
            placeholder={t('categorizePage.firstCategoryName')}
            className="bg-white"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleNewGroupSave}
              disabled={!newGroupName?.trim() || !newGroupFirstCategoryName?.trim() || newGroupSaving}
            >
              {newGroupSaving ? t('categorizePage.saving') : t('editCategory.save')}
            </Button>
            <Button type="button" variant="secondary" onClick={handleNewGroupCancel}>
              {t('editCategory.cancel')}
            </Button>
          </div>
        </div>
      ) : showQuickCreate ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {t('categorizePage.newCategoryInGroup', { group: quickCreateGroup })}
          </label>
          <Input
            type="text"
            value={quickCreateName}
            onChange={(e) => setQuickCreateName(e.target.value)}
            placeholder={t('categorizePage.newCategoryInGroup', { group: quickCreateGroup })}
            className="bg-white"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleQuickCreateSave}
              disabled={!quickCreateName?.trim() || quickCreateSaving}
            >
              {quickCreateSaving ? t('categorizePage.saving') : t('editCategory.save')}
            </Button>
            <Button type="button" variant="secondary" onClick={handleQuickCreateCancel}>
              {t('editCategory.cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <Combobox
          value={value || ''}
          onChange={handleComboboxChange}
          disabled={disabled}
        >
          <div className="relative">
            <div
              className={clsx(
                'flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-700',
                'border-slate-200 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500',
                disabled && 'cursor-not-allowed bg-slate-50 opacity-70'
              )}
            >
              <Combobox.Input
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-slate-800 placeholder-slate-400 focus:ring-0"
                placeholder={t('uncategorized.chooseCategory')}
                displayValue={() => inputDisplayValue}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              <Combobox.Button className="shrink-0">
                <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />
              </Combobox.Button>
            </div>

            <Combobox.Options
              className={clsx(
                'absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5'
              )}
              aria-label={t('categorizePage.groupsAndCategories')}
            >
              <div className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                {t('categorizePage.groupsAndCategories')}
              </div>
              {grouped.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-slate-500">
                  {t('categorizePage.noCategoriesForType', 'No categories for this type')}
                </div>
              ) : (
                grouped.map(({ groupName, items }) => (
                  <div key={groupName || 'ungrouped'} className="py-1" role="group" aria-label={t('categorizePage.group') + ': ' + (groupName || t('categorizePage.ungrouped'))}>
                    <div className="sticky top-9 z-10 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 border-b border-slate-200">
                      {groupName || t('categorizePage.ungrouped', 'Other')}
                    </div>
                    {items.map((c) => (
                      <Combobox.Option
                        key={c.id}
                        value={c.id}
                        className={({ active }) =>
                          clsx(
                            'flex cursor-pointer items-center gap-2 pl-6 pr-3 py-2 text-sm',
                            active ? 'bg-primary-50 text-primary-800' : 'text-slate-700'
                          )
                        }
                      >
                        <DynamicIcon name={c?.iconKey || 'Tag'} size={18} className="shrink-0 text-slate-500" />
                        <span className="min-w-0 flex-1 truncate">{c.name}</span>
                      </Combobox.Option>
                    ))}
                    {hasCreate && (
                      <Combobox.Option
                        value={`${ADD_PREFIX}${groupName || ''}`}
                        className={({ active }) =>
                          clsx(
                            'flex cursor-pointer items-center gap-2 pl-5 pr-3 py-2 text-sm text-slate-500 border-t border-slate-50',
                            active && 'bg-primary-50 text-primary-700'
                          )
                        }
                      >
                        <Plus className="h-4 w-4 shrink-0" />
                        <span>{t('categorizePage.addNewCategoryToGroup', { group: groupName || t('categorizePage.ungrouped') })}</span>
                      </Combobox.Option>
                    )}
                  </div>
                ))
              )}
              {hasCreate && (
                <Combobox.Option
                  value={NEW_GROUP_VALUE}
                  className={({ active }) =>
                    clsx(
                      'flex cursor-pointer items-center gap-2 pl-5 pr-3 py-2 text-sm text-slate-500 border-t border-slate-200 mt-1',
                      active && 'bg-primary-50 text-primary-700'
                    )
                  }
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>{t('categorizePage.createNewGroup')}</span>
                </Combobox.Option>
              )}
            </Combobox.Options>
          </div>
        </Combobox>
      )}
    </div>
  );
}
