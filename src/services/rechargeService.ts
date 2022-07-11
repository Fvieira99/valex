import {
  checkIfCardExists,
  checkIfCardExpired,
  checkIfCardIsActivated
} from "../services/cardService.js";

import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function verifyCard(cardId: number) {
  const card = await checkIfCardExists(cardId);
  checkIfCardExpired(card.expirationDate);
  checkIfCardIsActivated(card.password);
  return card;
}

export async function recharge(cardId: number, amount: number) {
  await rechargeRepository.insert({ cardId, amount });
}
