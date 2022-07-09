import { Request, Response } from "express";
import * as employeeService from "../services/employeesService.js";
import * as cardsService from "../services/cardsService.js";
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function createCard(req: Request, res: Response) {
  const {
    employeeId,
    cardType
  }: { employeeId: number; cardType: TransactionTypes } = req.body;
  const apiKey = res.locals.apiKey;

  const fullName = await employeeService.checkEmployeeAndCompany(
    employeeId,
    apiKey
  );
  await cardsService.checkIfEmployeeHasCardType(employeeId, cardType);
  await cardsService.createCard(fullName, cardType, employeeId);
  res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
  const { cardId, inputSecurityCode, password } = req.body;

  const card = await cardsService.checkIfCardIsAbleToActivate(cardId);
  await cardsService.activateCard(
    card.securityCode,
    inputSecurityCode,
    password,
    cardId
  );
  res.sendStatus(200);
}

export async function blockCard(req: Request, res: Response) {
  const { cardId, password } = req.body;

  const { isBlockedStatus, hashedPassword } =
    await cardsService.checkCardBlockPossibility(cardId);
  await cardsService.toggleIsBlockedStatus(
    cardId,
    password,
    isBlockedStatus,
    hashedPassword
  );

  res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
  const { cardId, password } = req.body;

  const { isBlockedStatus, hashedPassword } =
    await cardsService.checkCardUnblockPossibility(cardId);
  await cardsService.toggleIsBlockedStatus(
    cardId,
    password,
    isBlockedStatus,
    hashedPassword
  );

  res.sendStatus(200);
}
