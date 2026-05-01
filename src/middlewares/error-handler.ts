import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { errorCode } from "../config/error-code";
import { createError } from "../utils/error";

export const handleValidationError = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req).array({ onlyFirstError: true });

  if (result.length > 0) {
    const error = createError({
      message: result[0]?.msg,
      status: 400,
      code: errorCode.invalid,
    });

    return next(error);
  } else {
    next();
  }
};