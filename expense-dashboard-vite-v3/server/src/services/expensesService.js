/**
 * Aggregate transactions into fixed vs variable recurring expenses.
 */

import * as transactionStorage from '../storage/transactionStorage.js';
import * as categoryService from './categoryService.js';

const AMOUNT_TOLERANCE_RATIO = 0.05; // 5% variance => fixed

function filterTransactions(transactions, filters) {
  let list = [...(transactions || [])];
  const { card, from, to, category } = filters || {};
  if (card) list = list.filter((t) => t.card === card);
  if (from) list = list.filter((t) => t.purchaseDate >= from);
  if (to) list = list.filter((t) => t.purchaseDate <= to);
  if (category) list = list.filter((t) => t.categoryId === category);
  return list;
}

function groupByMerchant(transactions) {
  const groups = new Map();
  for (const t of transactions) {
    const key = (t.merchant || t.merchantRaw || '').trim() || '—';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }
  return groups;
}

function resolveCategoryName(categoryId) {
  if (!categoryId) return '—';
  const cat = categoryService.findById(categoryId);
  return cat?.name ?? '—';
}

function isFixedGroup(txs) {
  if (!txs.length) return false;
  if (txs.length === 1) return true;
  const amounts = txs.map((t) => Number(t.amount)).filter((n) => !isNaN(n));
  if (!amounts.length) return false;
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const range = max - min;
  return avg !== 0 && range / avg <= AMOUNT_TOLERANCE_RATIO;
}

function buildFixedItem(merchant, txs) {
  const amounts = txs.map((t) => Number(t.amount)).filter((n) => !isNaN(n));
  const sorted = [...txs].sort((a, b) => (b.purchaseDate || '').localeCompare(a.purchaseDate || ''));
  const lastTx = sorted[0];
  const categoryId = lastTx?.categoryId ?? txs.find((t) => t.categoryId)?.categoryId;
  const avgAmount = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
  return {
    merchant,
    category: resolveCategoryName(categoryId),
    categoryId,
    lastAmount: lastTx ? Number(lastTx.amount) : avgAmount,
    averageAmount: avgAmount,
    frequency: 'monthly',
    card: lastTx?.card ?? '—',
    lastChargeDate: lastTx?.purchaseDate ?? null,
    transactions: sorted,
  };
}

function buildVariableItem(merchant, txs) {
  const amounts = txs.map((t) => Number(t.amount)).filter((n) => !isNaN(n));
  const sorted = [...txs].sort((a, b) => (b.purchaseDate || '').localeCompare(a.purchaseDate || ''));
  const lastTx = sorted[0];
  const categoryId = lastTx?.categoryId ?? txs.find((t) => t.categoryId)?.categoryId;
  const sum = amounts.reduce((a, b) => a + b, 0);
  const count = amounts.length;
  return {
    merchant,
    category: resolveCategoryName(categoryId),
    categoryId,
    count,
    averageAmount: count ? sum / count : 0,
    minAmount: count ? Math.min(...amounts) : 0,
    maxAmount: count ? Math.max(...amounts) : 0,
    lastAmount: lastTx ? Number(lastTx.amount) : 0,
    trend: '—',
    transactions: sorted,
  };
}

export function getRecurring(type, filters = {}) {
  const all = transactionStorage.getAll();
  const filtered = filterTransactions(all, filters);
  const groups = groupByMerchant(filtered);
  const recurring = [];

  for (const [merchant, txs] of groups) {
    if (!txs.length) continue;
    const fixed = isFixedGroup(txs);
    if (type === 'fixed' && fixed) {
      recurring.push(buildFixedItem(merchant, txs));
    } else if (type === 'variable' && !fixed) {
      recurring.push(buildVariableItem(merchant, txs));
    }
  }

  return { recurring };
}
