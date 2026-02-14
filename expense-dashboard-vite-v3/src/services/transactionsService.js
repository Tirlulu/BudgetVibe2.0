/**
 * Transactions API.
 * GET /api/transactions - list with query params (from, to, card, category, uncategorized, limit, offset).
 * PATCH /api/transactions/:id - update category (body: { categoryId }).
 * PATCH /api/transactions/bulk-category - bulk assign category (body: { ids, categoryId }).
 * DELETE /api/transactions - delete all transactions.
 */

import api from './apiClient.js';

const TRANSACTIONS_PATH = '/api/transactions';

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') search.set(key, String(value));
  });
  const q = search.toString();
  return q ? `?${q}` : '';
}

export async function getTransactions(params = {}) {
  const query = buildQuery(params);
  return api.get(`${TRANSACTIONS_PATH}${query}`);
}

export async function deleteAllTransactions() {
  return api.delete(TRANSACTIONS_PATH);
}

export async function updateTransactionCategory(id, categoryId) {
  return api.patch(`${TRANSACTIONS_PATH}/${id}`, { categoryId });
}

export async function bulkUpdateCategory(ids, categoryId) {
  return api.patch(`${TRANSACTIONS_PATH}/bulk-category`, { ids, categoryId });
}
