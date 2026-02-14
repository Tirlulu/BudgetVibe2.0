/**
 * Import use case: parse credit card files, deduplicate, persist new transactions, return summary.
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

/**
 * Build a deduplication signature: isoDate_amount_merchant (sanitized).
 */
function buildSignature(isoDate, amount, merchantName) {
  const date = String(isoDate ?? '').trim().slice(0, 10);
  const amt = Number(amount);
  const num = Number.isNaN(amt) ? 0 : amt;
  const merchant = String(merchantName ?? '').trim().toLowerCase();
  return `${date}_${num}_${merchant}`;
}

/**
 * Process uploaded credit card statement files: parse, deduplicate, persist only new rows, return summary.
 * @param {Array<{ buffer: Buffer, originalname?: string }>} files - Multer file objects
 * @returns {Promise<{ success: boolean, added: number, skipped: number, totalProcessed: number }>}
 */
export async function processCreditCardUpload(files) {
  const existing = transactionStorage.getAll();
  const signatureSet = new Set(
    existing.map((t) =>
      buildSignature(t.purchaseDate, t.amount, t.merchant ?? t.merchantRaw)
    )
  );

  let skippedCount = 0;
  const newTransactions = [];

  for (const file of files || []) {
    const buffer = file.buffer;
    const card = file.originalname ? file.originalname.replace(/\.[^.]*$/, '') : null;
    const parsed = parseCreditCardExcel(buffer);
    const now = new Date().toISOString();

    for (const row of parsed) {
      const isoDate = (row.purchaseDate || '').toString().slice(0, 10);
      const signature = buildSignature(
        row.purchaseDate,
        row.amount,
        row.merchant ?? row.merchantRaw
      );

      if (signatureSet.has(signature)) {
        skippedCount += 1;
        continue;
      }

      signatureSet.add(signature);

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
        isVerified: false,
        card,
        createdAt: now,
      };

      const suggestedCategoryId = await categorizer(tx);
      if (suggestedCategoryId) {
        tx.categoryId = suggestedCategoryId;
      }

      newTransactions.push(tx);
    }
  }

  if (newTransactions.length > 0) {
    transactionStorage.addMany(newTransactions);
  }

  const totalProcessed = newTransactions.length + skippedCount;

  return {
    success: true,
    added: newTransactions.length,
    skipped: skippedCount,
    totalProcessed,
  };
}

/**
 * Assign a category to a transaction. Returns the updated transaction or null if not found.
 * Increments the category's usageCount for adaptive sorting.
 */
export async function assignTransactionCategory(transactionId, categoryId) {
  const existing = transactionStorage.getById(transactionId);
  if (!existing) return null;
  const updated = transactionStorage.update(transactionId, {
    categoryId,
    manuallyCategorized: true,
    isVerified: true,
  });
  if (updated && categoryId) {
    categoryService.incrementUsageCount(categoryId);
  }
  return updated;
}
