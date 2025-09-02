import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

export function isValidId(paramName = "id") {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!isValidObjectId(id)) {
      return next(
        createHttpError.BadRequest(`Invalid ObjectId in param: ${paramName}`)
      );
    }
    next();
  };
}
