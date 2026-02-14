import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parseCreditCardExcel } from '../lib/excelParser.js';
import * as transactionStorage from '../storage/transactionStorage.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export const uploadMiddleware = upload.array('files', 10);

export function handleMulterError(err, req, res, next) {
  if (!err) return next();
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large' });
  }
  if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: err.message || 'Upload limit exceeded' });
  }
  next(err);
}

/**
 * GET /health - confirm import API is responding.
 */
export function getHealth(req, res) {
  res.status(200).json({ ok: true });
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
 * POST /credit-card - parse Excel, save transactions, return real counts.
 * Frontend expects: { totalTransactions, autoCategorizedCount, needsCategoryCount, needsCategory }.
 */
export function postCreditCard(req, res) {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

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
          card,
          createdAt: now,
        };
        allTransactions.push(tx);
      }
    }

    transactionStorage.addMany(allTransactions);

    const totalTransactions = allTransactions.length;
    const autoCategorizedCount = 0;
    const needsCategoryCount = totalTransactions;
    const needsCategory = allTransactions.map(toNeedsCategoryItem);

    res.status(200).json({
      totalTransactions,
      autoCategorizedCount,
      needsCategoryCount,
      needsCategory,
    });
  } catch (err) {
    console.error('postCreditCard error:', err?.message ?? err);
    res.status(500).json({ message: err.message || 'Import failed' });
  }
}

/**
 * PATCH /transactions/:id/category - update transaction category in storage.
 */
export function patchTransactionCategory(req, res) {
  try {
    const { id } = req.params;
    const { categoryId } = req.body || {};
    if (!id || !categoryId) {
      return res.status(400).json({ message: 'transaction id and categoryId required' });
    }
    const updated = transactionStorage.update(id, { categoryId });
    if (!updated) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to assign category' });
  }
}
