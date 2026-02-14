import { useState, useEffect, useCallback, useMemo } from 'react';
import * as categoriesService from '../services/categoriesService.js';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriesService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createCategory = useCallback(async (payload) => {
    try {
      const created = await categoriesService.createCategory(payload);
      setCategories((prev) => [...(Array.isArray(prev) ? prev : []), created].filter(Boolean));
      return created;
    } catch (err) {
      setError(err?.message || 'Failed to create category');
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id, payload) => {
    try {
      const updated = await categoriesService.updateCategory(id, payload);
      setCategories((prev) => (Array.isArray(prev) ? prev : []).map((c) => (c?.id === id ? { ...c, ...updated } : c)));
      return updated;
    } catch (err) {
      setError(err?.message || 'Failed to update category');
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      await categoriesService.deleteCategory(id);
      setCategories((prev) => (Array.isArray(prev) ? prev : []).filter((c) => c?.id !== id));
    } catch (err) {
      setError(err?.message || 'Failed to delete category');
      throw err;
    }
  }, []);

  const toggleCategoryActive = useCallback(async (id, isActive) => {
    try {
      const updated = await categoriesService.toggleCategoryActive(id, isActive);
      setCategories((prev) =>
        (Array.isArray(prev) ? prev : []).map((c) => (c?.id === id ? { ...c, ...updated } : c))
      );
      return updated;
    } catch (err) {
      setError(err?.message || 'Failed to toggle category');
      throw err;
    }
  }, []);

  const data = categories;
  const options = data;

  const grouped = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    const order = [];
    const byGroup = new Map();
    for (const c of list) {
      const g = c?.group ?? '';
      if (!byGroup.has(g)) {
        order.push(g);
        byGroup.set(g, []);
      }
      byGroup.get(g).push(c);
    }
    return order.map((groupName) => ({ groupName, items: byGroup.get(groupName) || [] }));
  }, [categories]);

  return {
    data,
    grouped,
    options,
    categories: data,
    isLoading,
    error,
    refresh: load,
    reload: load,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
  };
}
