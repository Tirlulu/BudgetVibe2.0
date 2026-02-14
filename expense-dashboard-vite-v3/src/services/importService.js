/**
 * Import / credit-card upload API.
 * POST /api/import/credit-card - upload file; returns totalTransactions, autoCategorizedCount, needsCategoryCount, needsCategory[].
 * PATCH /api/import/transactions/:id/category - assign category to a transaction.
 */

import api from './apiClient.js';

const IMPORT_PATH = '/api/import';

export async function postImportCreditCard(formData) {
  const res = await api.post(`${IMPORT_PATH}/credit-card`, formData);
  return res;
}

export async function assignCategory(transactionId, categoryId) {
  const res = await api.patch(`${IMPORT_PATH}/transactions/${transactionId}/category`, { categoryId });
  return res;
}
