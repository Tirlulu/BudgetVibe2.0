import { z } from 'zod';

export const patchTransactionCategoryParamsSchema = z.object({
  id: z.string().uuid(),
});

export const patchTransactionCategoryBodySchema = z.object({
  categoryId: z.string().uuid(),
});
