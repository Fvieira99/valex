import { Request, Response } from "express";
import * as employeeService from "../services/employeeService.js";
import * as rechargeService from "../services/rechargeService.js";

export async function recharge(req: Request, res: Response) {
  const { cardId, amount } = req.body;
  const apiKey = res.locals.apiKey;
  const card = await rechargeService.verifyCard(cardId);
  await employeeService.verifyEmployeeAndCompany(card.employeeId, apiKey);
  await rechargeService.recharge(cardId, amount);

  res.status(200).send("Recharge done!");
}
