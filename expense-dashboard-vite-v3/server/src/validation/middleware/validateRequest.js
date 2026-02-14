/**
 * Generic validation middleware. Pass Zod schemas for params, query, and/or body.
 * On success, assigns parsed values to req.validated; on ZodError, responds 400.
 */
export function validateRequest(schemas) {
  const { params: paramsSchema, query: querySchema, body: bodySchema } = schemas || {};

  return (req, res, next) => {
    try {
      const validated = {};
      if (paramsSchema) {
        validated.params = paramsSchema.parse(req.params);
      }
      if (querySchema) {
        validated.query = querySchema.parse(req.query);
      }
      if (bodySchema) {
        validated.body = bodySchema.parse(req.body);
      }
      req.validated = validated;
      next();
    } catch (err) {
      if (err.name === 'ZodError') {
        const errors = err.errors?.map((e) => ({ path: e.path.join('.'), message: e.message })) ?? [];
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      next(err);
    }
  };
}
