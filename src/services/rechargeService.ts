import {
  checkIfCardExists,
  checkIfCardExpired,
  cardIsActivated
} from "../services/cardService.js";

import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { unauthorizedError } from "../middlewares/errorHandlerMiddleware.js";

export async function verifyCard(cardId: number) {
  const card = await checkIfCardExists(cardId);
  checkIfCardExpired(card.expirationDate);
  if (!cardIsActivated(card.password)) {
    throw unauthorizedError();
  }
  return card;
}

export async function recharge(cardId: number, amount: number) {
  await rechargeRepository.insert({ cardId, amount });
}
