import { z } from 'zod';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const listTransactionsQuerySchema = z.object({
  from: z.string().regex(isoDateRegex).optional(),
  to: z.string().regex(isoDateRegex).optional(),
  card: z.string().optional(),
  category: z.string().uuid().optional(),
  uncategorized: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const bulkCategoryBodySchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  categoryId: z.string().uuid(),
});

export const patchTransactionParamsSchema = z.object({
  id: z.string().uuid(),
});

export const patchTransactionBodySchema = z.object({
  categoryId: z.string().uuid(),
});
