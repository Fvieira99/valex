import { NextFunction } from "connect";
import { Request, Response } from "express";
import { unauthorizedError } from "./errorHandlerMiddleware.js";
import * as companyRepository from "../repositories/companyRepository.js";

export default async function validateAPIKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"];
  console.log(apiKey);
  if (!apiKey) {
    throw unauthorizedError();
  }

  const company = await companyRepository.findByApiKey(apiKey);
  console.log(company);
  if (!company) {
    throw unauthorizedError();
  }

  res.locals.apiKey = apiKey;
  next();
}
