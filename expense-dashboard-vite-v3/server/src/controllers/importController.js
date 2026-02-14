import multer from 'multer';
import * as importService from '../services/importService.js';

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

export function getHealth(req, res) {
  res.status(200).json({ ok: true });
}

export async function postCreditCard(req, res) {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const result = await importService.processCreditCardUpload(files);
    res.status(200).json(result);
  } catch (err) {
    console.error('postCreditCard error:', err?.message ?? err);
    res.status(500).json({ message: err.message || 'Import failed' });
  }
}

export async function patchTransactionCategory(req, res) {
  try {
    const { id } = req.validated?.params ?? req.params;
    const { categoryId } = req.validated?.body ?? req.body ?? {};
    const updated = await importService.assignTransactionCategory(id, categoryId);
    if (!updated) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to assign category' });
  }
}
