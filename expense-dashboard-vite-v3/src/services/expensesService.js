/**
 * Expenses API. Assumed endpoints:
 * GET /api/expenses/recurring?type=fixed&card=...&from=...&to=...&category=...
 * GET /api/expenses/recurring?type=variable&card=...&from=...&to=...&category=...
 * PATCH /api/expenses/recurring/:id (e.g. update category assignment) - optional
 */

import api from './apiClient.js';

const RECURRING_PATH = '/api/expenses/recurring';

function buildQuery(params) {
  const sp = new URLSearchParams();
  if (params.type) sp.set('type', params.type);
  if (params.card) sp.set('card', params.card);
  if (params.from) sp.set('from', params.from);
  if (params.to) sp.set('to', params.to);
  if (params.category) sp.set('category', params.category);
  const q = sp.toString();
  return q ? `?${q}` : '';
}

export async function getRecurringExpenses({ type = 'fixed', card, from, to, category } = {}) {
  const query = buildQuery({ type, card, from, to, category });
  try {
    return await api.get(`${RECURRING_PATH}${query}`);
  } catch (err) {
    if (err.status === 404 || err.status >= 500) return { recurring: [], oneTime: [] };
    throw err;
  }
}

export async function getFixedExpenses(filters = {}) {
  const data = await getRecurringExpenses({ ...filters, type: 'fixed' });
  return Array.isArray(data?.recurring) ? data.recurring : data ?? [];
}

export async function getVariableExpenses(filters = {}) {
  const data = await getRecurringExpenses({ ...filters, type: 'variable' });
  return Array.isArray(data?.recurring) ? data.recurring : data ?? [];
}

export async function updateRecurringExpenseCategory(id, categoryId) {
  return api.patch(`${RECURRING_PATH}/${id}`, { categoryId });
}
