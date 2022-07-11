import {
  badRequestError,
  unauthorizedError
} from "../middlewares/errorHandlerMiddleware.js";
import {
  checkIfCardExists,
  checkIfCardExpired,
  cardIsActivated,
  checkCardOwner,
  calcBalance
} from "../services/cardService.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

import bcrypt from "bcrypt";

export async function verifyCard(cardId: number, employeeId: number) {
  const card = await checkIfCardExists(cardId);
  checkIfCardExpired(card.expirationDate);
  if (!cardIsActivated(card.password)) {
    throw unauthorizedError();
  }
  if (card.isBlocked) {
    throw unauthorizedError();
  }
  checkCardOwner(employeeId, card.employeeId);
  return card;
}

export async function verifyBusiness(businessId: number, cardType: string) {
  const business = await businessRepository.findById(businessId);
  if (!business) {
    throw badRequestError();
  }

  if (business.type !== cardType) {
    throw badRequestError();
  }
}

export async function verifyBalance(cardId: number, amount: number) {
  const payments = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);

  const balance = calcBalance(payments, recharges);
  if (balance < amount) {
    throw badRequestError();
  }
}

export async function pay(
  inputPassword: string,
  amount: number,
  cardPassword: string,
  businessId: number,
  cardId: number
) {
  if (!bcrypt.compareSync(inputPassword, cardPassword)) {
    throw unauthorizedError();
  }

  await paymentRepository.insert({ businessId, cardId, amount });
}
