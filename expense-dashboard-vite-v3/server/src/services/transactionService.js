import { transactionStorage } from '../storage/index.js';
import * as categoryService from './categoryService.js';

export function list(filters = {}) {
  let items = transactionStorage.getAll();
  const { from, to, card, category, uncategorized, limit, offset } = filters;
  if (uncategorized === 'true') items = items.filter((t) => t.categoryId == null || t.categoryId === '');
  if (from) items = items.filter((t) => (t.purchaseDate || '') >= from);
  if (to) items = items.filter((t) => (t.purchaseDate || '') <= to);
  if (card) items = items.filter((t) => t.card === card);
  if (category) items = items.filter((t) => t.categoryId === category);
  const total = items.length;
  const off = Number(offset) || 0;
  const lim = Number(limit) != null && Number(limit) > 0 ? Number(limit) : items.length;
  const paginated = items.slice(off, off + lim);
  return { transactions: paginated, total };
}

export function updateCategory(id, categoryId) {
  const existing = transactionStorage.getById(id);
  if (!existing) return null;
  const updated = transactionStorage.update(id, { categoryId, manuallyCategorized: true });
  if (updated && categoryId) {
    categoryService.incrementUsageCount(categoryId);
  }
  return updated;
}

export function bulkUpdateCategory(ids, categoryId) {
  const updated = [];
  for (const id of ids || []) {
    const existing = transactionStorage.getById(id);
    if (existing) {
      const result = transactionStorage.update(id, { categoryId, manuallyCategorized: true });
      if (result) {
        updated.push(result.id);
        if (categoryId) categoryService.incrementUsageCount(categoryId);
      }
    }
  }
  return { updated: updated.length, ids: updated };
}

export function deleteAll() {
  transactionStorage.clear();
}
