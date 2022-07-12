import {
  badRequestError,
  conflictError,
  notFoundError,
  unauthorizedError
} from "../middlewares/errorHandlerMiddleware.js";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import "dayjs/locale/pt-br.js";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

dotenv.config();

const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);

export async function checkIfEmployeeHasCardType(
  employeeId: number,
  cardType: cardRepository.TransactionTypes
) {
  const card = await cardRepository.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );

  if (card) {
    throw conflictError();
  }
}

export async function createCard(
  fullName: string,
  cardType: cardRepository.TransactionTypes,
  employeeId: number
) {
  const cardNumber = generateCardNumber();
  const cardholderName = formatCardHolderName(fullName);
  const expirationDate = generateFormatedExpirationDate();
  const [securityCode, encryptedSecurityCode] = encryptCardSecurityCode();

  const newCardData = {
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode: encryptedSecurityCode,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type: cardType
  };

  await cardRepository.insert(newCardData);
  return securityCode;
}
export async function activateCard(
  inputPassword: string,
  cardId: number,
  inputSecurityCode: string,
  cardPassword: string,
  CardSecurityCode: string
) {
  if (cardIsActivated(cardPassword)) {
    throw badRequestError();
  }

  const decryptedSecurityCode = cryptr.decrypt(CardSecurityCode);
  if (decryptedSecurityCode !== inputSecurityCode) {
    throw unauthorizedError();
  }

  const hashedPassword = hashPassword(inputPassword);

  const updatedCardData = {
    password: hashedPassword
  };

  await cardRepository.update(cardId, updatedCardData);
}

export async function blockCard(
  cardId: number,
  inputPassword: string,
  isBlockedStatus: boolean,
  cardPassword: string
) {
  if (isBlockedStatus) {
    throw badRequestError();
  }

  if (!bcrypt.compareSync(inputPassword, cardPassword)) {
    throw unauthorizedError();
  }

  const updatedCardData = { isBlocked: true };
  await cardRepository.update(cardId, updatedCardData);
}

export async function unblockCard(
  cardId: number,
  inputPassword: string,
  isBlockedStatus: boolean,
  cardPassword: string
) {
  if (!isBlockedStatus) {
    throw badRequestError();
  }

  if (!bcrypt.compareSync(inputPassword, cardPassword)) {
    throw unauthorizedError();
  }

  const updatedCardData = { isBlocked: false };
  await cardRepository.update(cardId, updatedCardData);
}

export async function getCardStatement(cardId: number) {
  const card = await checkIfCardExists(cardId);

  const payments = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);

  const balance = calcBalance(payments, recharges);

  const cardStatement = {
    balance,
    transactions: payments,
    recharges
  };

  return cardStatement;
}

export async function verifyCard(cardId: number, employeeId: number) {
  const card = await checkIfCardExists(cardId);
  checkIfCardExpired(card.expirationDate);
  checkCardOwner(employeeId, card.employeeId);
  return card;
}

export async function checkIfCardExists(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) {
    throw notFoundError();
  }

  return card;
}

export function checkIfCardExpired(expirationDate: string) {
  const currentDate = dayjs().locale("pt-br").format("MM/YY");
  const isExpired = dayjs(currentDate).isAfter(expirationDate);

  if (isExpired) {
    throw badRequestError();
  }
}

export function checkCardOwner(employeeId: number, cardEmployeeId: number) {
  if (employeeId !== cardEmployeeId) {
    throw unauthorizedError();
  }
}

export function cardIsActivated(password: string) {
  if (password === null) {
    return false;
  }
  return true;
}

export function calcBalance(payments: any[], recharges: any[]): number {
  let paymentsTotal = 0;
  let rechargesTotal = 0;

  payments.forEach(payment => (paymentsTotal += payment.amount));
  recharges.forEach(recharge => (rechargesTotal += recharge.amount));

  return rechargesTotal - paymentsTotal;
}

function generateCardNumber(): string {
  const cardNumber = faker.finance.creditCardNumber();
  return cardNumber;
}

function formatCardHolderName(fullName: string): string {
  const filteredNameArr = fullName.split(" ").filter(name => name.length >= 3);
  const formatedNameArr = filteredNameArr.map((name, index) => {
    if (index === 0 || index === filteredNameArr.length - 1) {
      return name.toUpperCase();
    } else {
      return name[0].toUpperCase();
    }
  });

  return formatedNameArr.join(" ");
}

function generateFormatedExpirationDate(): string {
  const currentDate = dayjs().locale("pt-br").format("MM/YY");

  const [currentMonth, currentYear] = currentDate.split("/");

  const expirationYear = calcExpirationDate(currentYear);
  const formatedExpirationYear = expirationYear.toString();

  const formatedExpirationDate = `${currentMonth}/${formatedExpirationYear}`;
  return formatedExpirationDate;
}

function encryptCardSecurityCode(): string[] {
  const securityCode = faker.finance.creditCardCVV();
  const encryptedSecurityCode = cryptr.encrypt(securityCode);
  return [securityCode, encryptedSecurityCode];
}

function calcExpirationDate(currentYear: string) {
  const expirationGap = 5;
  return parseInt(currentYear) + expirationGap;
}

function hashPassword(password: string) {
  const hashSalt = 10;
  const hashedPassword = bcrypt.hashSync(password, hashSalt);
  return hashedPassword;
}
