import createHttpError from "http-errors";

export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (error) {
      const details = error.details?.map((d) => d.message) || [error.message];
      const err = createHttpError.BadRequest("Validation error");
      err.details = details;
      next(err);
    }
  };
}
