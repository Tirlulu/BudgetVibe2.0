import { z } from 'zod';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const getRecurringQuerySchema = z.object({
  type: z.enum(['fixed', 'variable']).default('fixed'),
  card: z.string().optional(),
  from: z.string().regex(isoDateRegex).optional(),
  to: z.string().regex(isoDateRegex).optional(),
  category: z.string().uuid().optional(),
});
