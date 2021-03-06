import { NextFunction } from "connect";
import { Request, Response } from "express";

const messageToStatusCode = {
  unauthorized: 401,
  not_found: 404,
  conflict: 409,
  forbidden: 403,
  bad_request: 400
};

export function badRequestError() {
  return { type: "bad_request" };
}

export function forbiddenError() {
  return { type: "forbidden" };
}

export function conflictError() {
  return { type: "conflict" };
}

export function unauthorizedError() {
  return { type: "unauthorized" };
}

export function notFoundError() {
  return { type: "not_found" };
}

export default async function handleError(
  error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  if (error.type) {
    return res.sendStatus(messageToStatusCode[error.type]);
  }

  res.sendStatus(500);
}
