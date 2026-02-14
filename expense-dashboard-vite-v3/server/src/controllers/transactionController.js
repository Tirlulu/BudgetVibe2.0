import * as transactionService from '../services/transactionService.js';

export function list(req, res) {
  try {
    const query = req.validated?.query ?? req.query;
    const filters = {
      from: query.from,
      to: query.to,
      card: query.card,
      category: query.category,
      uncategorized: query.uncategorized,
      limit: query.limit,
      offset: query.offset,
    };
    const result = transactionService.list(filters);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list transactions' });
  }
}

export function deleteAll(req, res) {
  try {
    transactionService.deleteAll();
    res.status(200).json({ deleted: true });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete transactions' });
  }
}

export function bulkUpdateCategory(req, res) {
  try {
    const { ids, categoryId } = req.validated?.body ?? req.body ?? {};
    const result = transactionService.bulkUpdateCategory(ids, categoryId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to bulk update category' });
  }
}

export function updateCategory(req, res) {
  try {
    const { id } = req.validated?.params ?? req.params;
    const { categoryId } = req.validated?.body ?? req.body ?? {};
    const updated = transactionService.updateCategory(id, categoryId);
    if (!updated) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update category' });
  }
}
