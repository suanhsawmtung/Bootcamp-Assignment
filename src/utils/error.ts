import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status;
  const message = error.message ?? "Server Error";
  const errorCode = error.code ?? "Error_Code";

  res.status(status).json({ message, error: errorCode });
};

export const createError = ({
  message,
  status,
  code,
}: {
  message: string;
  status: number;
  code: string;
}) => {
  const error: any = new Error(message);
  error.status = status;
  error.code = code;

  return error;
};