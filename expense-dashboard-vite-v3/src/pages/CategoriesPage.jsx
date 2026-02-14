import React, { useMemo, useState } from 'react';
import CategoryForm from '../components/CategoryForm.jsx';
import CategoryList from '../components/CategoryList.jsx';
import { useCategories } from '../hooks/useCategories.js';

export default function CategoriesPage() {
  const hook = useCategories();
  const categories = Array.isArray(hook?.categories) ? hook.categories : [];
  const isLoading = !!hook?.isLoading;
  const error = hook?.error ?? null;
  const createCategory = typeof hook?.createCategory === 'function' ? hook.createCategory : async () => {};
  const updateCategory = typeof hook?.updateCategory === 'function' ? hook.updateCategory : async () => {};
  const deleteCategory = typeof hook?.deleteCategory === 'function' ? hook.deleteCategory : async () => {};
  const toggleCategoryActive = typeof hook?.toggleCategoryActive === 'function' ? hook.toggleCategoryActive : async () => {};

  const [filter, setFilter] = useState('all');
  const filteredCategories = useMemo(() => {
    if (filter === 'active') return categories.filter((c) => c?.isActive === true);
    if (filter === 'inactive') return categories.filter((c) => c?.isActive === false);
    return categories;
  }, [categories, filter]);

  const groups = useMemo(() => {
    return categories.map((c) => c?.group).filter(Boolean);
  }, [categories]);

  return (
    <div className="page categories-page">
      <h1>Categories</h1>
      <p className="muted">Manage main categories used to classify transactions.</p>
      <CategoryForm onSubmit={createCategory} groups={groups} />
      {error && <p className="upload-err">{error}</p>}
      {isLoading ? (
        <p className="muted">Loading…</p>
      ) : (
        <CategoryList
          categories={filteredCategories}
          filter={filter}
          onFilterChange={setFilter}
          onToggleActive={toggleCategoryActive}
          onEdit={updateCategory}
          onDelete={deleteCategory}
        />
      )}
    </div>
  );
}
