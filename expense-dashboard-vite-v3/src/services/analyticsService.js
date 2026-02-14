/**
 * Analytics API. Assumed endpoints:
 * GET /api/analytics/summary?card=...&from=...&to=...&category=...
 * Returns: { byCategory: [], byMonth: [], byCard: [], topMerchants: [] } or similar.
 * If backend is not ready, use mock data (see getMockSummary).
 */

import api from './apiClient.js';

const SUMMARY_PATH = '/api/analytics/summary';

function buildQuery(params) {
  const sp = new URLSearchParams();
  if (params.card) sp.set('card', params.card);
  if (params.from) sp.set('from', params.from);
  if (params.to) sp.set('to', params.to);
  if (params.category) sp.set('category', params.category);
  const q = sp.toString();
  return q ? `?${q}` : '';
}

export async function getAnalyticsSummary({ card, from, to, category } = {}) {
  try {
    const query = buildQuery({ card, from, to, category });
    return await api.get(`${SUMMARY_PATH}${query}`);
  } catch (err) {
    if (err.status === 404 || err.status >= 500) {
      return getMockSummary();
    }
    throw err;
  }
}

/** Mock data when backend is unavailable. Replace with real API when ready. */
function getMockSummary() {
  const now = new Date();
  const thisYear = now.getFullYear();
  const byCategory = [
    { category: 'Groceries', total: 4200, average: 350, count: 12 },
    { category: 'Utilities', total: 1800, average: 150, count: 12 },
    { category: 'Subscriptions', total: 600, average: 50, count: 12 },
    { category: 'Transport', total: 900, average: 75, count: 12 },
  ];
  const byMonth = Array.from({ length: 12 }, (_, i) => ({
    month: `${thisYear}-${String(i + 1).padStart(2, '0')}`,
    total: 600 + Math.round(Math.random() * 400),
  }));
  const byCard = [
    { card: '****1234', total: 4200 },
    { card: '****5678', total: 3300 },
  ];
  const topMerchants = [
    { merchant: 'Supersal', total: 2400, count: 24 },
    { merchant: 'Electric Co', total: 1200, count: 12 },
  ];
  return { byCategory, byMonth, byCard, topMerchants };
}
