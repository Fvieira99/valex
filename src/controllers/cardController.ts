import { Request, Response } from "express";
import * as employeeService from "../services/employeeService.js";
import * as cardsService from "../services/cardService.js";
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function createCard(req: Request, res: Response) {
  const {
    employeeId,
    cardType
  }: { employeeId: number; cardType: TransactionTypes } = req.body;
  const apiKey = res.locals.apiKey;

  const fullEmployeeName = await employeeService.verifyEmployeeAndCompany(
    employeeId,
    apiKey
  );
  await cardsService.checkIfEmployeeHasCardType(employeeId, cardType);
  const securityCode = await cardsService.createCard(
    fullEmployeeName,
    cardType,
    employeeId
  );
  //Returning security code for test purposes
  res.status(201).send(`Save card security code: ${securityCode}`);
}

export async function activateCard(req: Request, res: Response) {
  const { cardId, inputSecurityCode, inputPassword, employeeId } = req.body;

  const card = await cardsService.verifyCard(cardId, employeeId);

  await cardsService.activateCard(
    inputPassword,
    cardId,
    inputSecurityCode,
    card.password,
    card.securityCode
  );
  res.sendStatus(200);
}

export async function blockCard(req: Request, res: Response) {
  const { cardId, inputPassword, employeeId } = req.body;

  const card = await cardsService.verifyCard(cardId, employeeId);
  await cardsService.blockCard(
    cardId,
    inputPassword,
    card.isBlocked,
    card.password
  );

  res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
  const { cardId, inputPassword, employeeId } = req.body;

  const card = await cardsService.verifyCard(cardId, employeeId);
  await cardsService.unblockCard(
    cardId,
    inputPassword,
    card.isBlocked,
    card.password
  );

  res.sendStatus(200);
}

export async function getCardStatement(req: Request, res: Response) {
  const { cardId } = req.params;

  const cardStatement = await cardsService.getCardStatement(parseInt(cardId));

  return res.send(cardStatement);
}
