import { Request, Response } from "express";
import * as paymentService from "../services/paymentService.js";

export async function pay(req: Request, res: Response) {
  const { cardId, employeeId, inputPassword, businessId, amount } = req.body;

  const card = await paymentService.verifyCard(cardId, employeeId);
  await paymentService.verifyBusiness(businessId, card.type);
  await paymentService.verifyBalance(cardId, amount);
  await paymentService.pay(
    inputPassword,
    amount,
    card.password,
    businessId,
    cardId
  );

  res.status(200).send("Payment Done!");
}
