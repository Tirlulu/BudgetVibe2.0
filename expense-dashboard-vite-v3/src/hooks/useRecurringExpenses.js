import { useState, useEffect, useCallback } from 'react';
import { getFixedExpenses, getVariableExpenses } from '../services/expensesService.js';

export function useRecurringExpenses(type = 'fixed', filters = {}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchFn = type === 'variable' ? getVariableExpenses : getFixedExpenses;
      const data = await fetchFn(filters);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [type, filters.card, filters.from, filters.to, filters.category]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handler = () => load();
    window.addEventListener('expenses-refresh', handler);
    return () => window.removeEventListener('expenses-refresh', handler);
  }, [load]);

  return { items, isLoading, error, reload: load };
}
