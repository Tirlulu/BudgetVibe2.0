import { useState, useEffect, useCallback } from 'react';
import { getAnalyticsSummary } from '../services/analyticsService.js';

export function useAnalytics(filters = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAnalyticsSummary(filters);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters.card, filters.from, filters.to, filters.category]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, reload: load };
}
