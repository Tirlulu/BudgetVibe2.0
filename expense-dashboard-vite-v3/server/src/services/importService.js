/**
 * Import use case: parse credit card files, persist transactions, return summary.
 * Categorization is delegated to a pluggable categorizer (default: no auto-category) for future ML.
 */

import { v4 as uuidv4 } from 'uuid';
import { parseCreditCardExcel } from '../lib/excelParser.js';
import { transactionStorage } from '../storage/index.js';
import * as categoryService from './categoryService.js';

/** Default: no auto-categorization. Replace with ML/heuristic module later. */
let categorizer = async () => null;

export function setCategorizer(fn) {
  categorizer = typeof fn === 'function' ? fn : async () => null;
}

function toNeedsCategoryItem(t) {
  return {
    id: t.id,
    merchantName: t.merchantRaw || t.merchant,
    merchant: t.merchant || t.merchantRaw,
    amount: t.amount,
    date: t.purchaseDate,
    purchaseDate: t.purchaseDate,
  };
}

/**
 * Process uploaded credit card statement files: parse, optionally categorize, persist, return summary.
 * @param {Array<{ buffer: Buffer, originalname?: string }>} files - Multer file objects
 * @returns {Promise<{ totalTransactions, autoCategorizedCount, needsCategoryCount, needsCategory }>}
 */
export async function processCreditCardUpload(files) {
  const allTransactions = [];
  for (const file of files) {
    const buffer = file.buffer;
    const card = file.originalname ? file.originalname.replace(/\.[^.]*$/, '') : null;
    const parsed = parseCreditCardExcel(buffer);
    const now = new Date().toISOString();
    for (const row of parsed) {
      const id = uuidv4();
      const tx = {
        id,
        purchaseDate: row.purchaseDate,
        merchantRaw: row.merchantRaw,
        merchant: row.merchant,
        amount: row.amount,
        currency: row.currency,
        categoryId: null,
        manuallyCategorized: false,
        card,
        createdAt: now,
      };
      const suggestedCategoryId = await categorizer(tx);
      if (suggestedCategoryId) {
        tx.categoryId = suggestedCategoryId;
      }
      allTransactions.push(tx);
    }
  }

  transactionStorage.addMany(allTransactions);

  const totalTransactions = allTransactions.length;
  const autoCategorizedCount = allTransactions.filter((t) => t.categoryId != null).length;
  const needsCategory = allTransactions.filter((t) => t.categoryId == null).map(toNeedsCategoryItem);
  const needsCategoryCount = needsCategory.length;

  return {
    totalTransactions,
    autoCategorizedCount,
    needsCategoryCount,
    needsCategory,
  };
}

/**
 * Assign a category to a transaction. Returns the updated transaction or null if not found.
 * Increments the category's usageCount for adaptive sorting.
 */
export async function assignTransactionCategory(transactionId, categoryId) {
  const existing = transactionStorage.getById(transactionId);
  if (!existing) return null;
  const updated = transactionStorage.update(transactionId, { categoryId, manuallyCategorized: true });
  if (updated && categoryId) {
    categoryService.incrementUsageCount(categoryId);
  }
  return updated;
}
