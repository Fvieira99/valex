import { Request, Response } from "express";
import * as employeeService from "../services/employeesService.js";
import * as cardsService from "../services/cardsService.js";
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function createCard(req: Request, res: Response) {
  const {
    employeeId,
    cardType
  }: { employeeId: number; cardType: TransactionTypes } = req.body;

  const fullName = await employeeService.checkIfEmployeeExists(employeeId);
  await cardsService.checkIfEmployeeHasCardType(employeeId, cardType);
  const cardInfos = await cardsService.createCard(fullName);

  // console.log(cardInfos);
}
