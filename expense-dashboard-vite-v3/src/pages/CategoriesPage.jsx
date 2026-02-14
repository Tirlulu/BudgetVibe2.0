import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CategoryForm from '../components/CategoryForm.jsx';
import CategoryList from '../components/CategoryList.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TableSkeleton from '../components/TableSkeleton.jsx';
import { useCategories } from '../hooks/useCategories.js';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const {
    data: categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
  } = useCategories();
  const [filter, setFilter] = useState('all');
  const [editCategory, setEditCategory] = useState(null);

  const filteredCategories = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    if (filter === 'active') return list.filter((c) => c?.isActive === true);
    if (filter === 'inactive') return list.filter((c) => c?.isActive === false);
    return list;
  }, [categories, filter]);

  const groupedFiltered = useMemo(() => {
    const order = [];
    const byGroup = new Map();
    for (const c of filteredCategories) {
      const g = c?.group ?? '';
      if (!byGroup.has(g)) {
        order.push(g);
        byGroup.set(g, []);
      }
      byGroup.get(g).push(c);
    }
    return order.map((groupName) => ({ groupName, items: byGroup.get(groupName) || [] }));
  }, [filteredCategories]);

  const groupOptions = useMemo(() => {
    return [...new Set((categories || []).map((c) => c?.group).filter(Boolean))].sort();
  }, [categories]);

  const handleEditSave = async (id, payload) => {
    await updateCategory(id, payload);
    setEditCategory(null);
  };

  return (
    <div className="page categories-page">
      <PageHeader title={t('pages.categories.title')} subtitle={t('pages.categories.subtitle')} />
      <CategoryForm onSubmit={createCategory} groups={groupOptions} />
      {error && <p className="upload-err">{error}</p>}
      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <CategoryList
          categories={filteredCategories}
          groupedCategories={groupedFiltered}
          filter={filter}
          onFilterChange={setFilter}
          onToggleActive={toggleCategoryActive}
          editCategory={editCategory}
          onEditClick={setEditCategory}
          onEditClose={() => setEditCategory(null)}
          onEditSave={handleEditSave}
          onDelete={deleteCategory}
          groupOptions={groupOptions}
        />
      )}
    </div>
  );
}
