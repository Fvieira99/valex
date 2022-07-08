import {
  conflictError,
  forbiddenError,
  notFoundError
} from "../middlewares/errorHandlerMiddleware.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import "dayjs/locale/pt-br.js";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

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
  const securityCode = generateCardSecurityCode();

  const newCardData = {
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode,
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type: cardType
  };

  await cardRepository.insert(newCardData);
}

export async function checkIfCardIsAbleToActivate(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) {
    throw notFoundError();
  }

  if (isExpiredCard(card.expirationDate)) {
    throw forbiddenError();
  }

  if (card.password !== null) {
    throw forbiddenError();
  }

  return card;
}

export async function activateCard(
  cardSecurityCode: string,
  inputSecurityCode: string,
  cardPassword: string,
  cardId: number
) {
  const decryptedSecurityCode = cryptr.decrypt(cardSecurityCode);
  if (decryptedSecurityCode !== inputSecurityCode) {
    throw forbiddenError();
  }

  const hashedPassword = hashPassword(cardPassword);

  const updatedCardData = {
    password: hashedPassword
  };

  await cardRepository.update(cardId, updatedCardData);
}

function generateCardNumber(): string {
  return faker.finance.creditCardNumber();
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

function generateCardSecurityCode(): string {
  const securityCode = faker.finance.creditCardCVV();
  const encryptedSecurityCode = cryptr.encrypt(securityCode);
  return encryptedSecurityCode;
}

function calcExpirationDate(currentYear: string) {
  const expirationGap = 5;
  return parseInt(currentYear) + expirationGap;
}

function isExpiredCard(expirationDate: string): boolean {
  const currentDate = dayjs().locale("pt-br").format("MM/YY");
  const [currentMonth, currentYear] = currentDate
    .split("/")
    .map(date => parseInt(date));
  const [expirationMonth, expirationYear] = expirationDate
    .split("/")
    .map(date => parseInt(date));

  if (currentYear > expirationYear) {
    return true;
  } else if (currentMonth > expirationMonth && currentYear === expirationYear) {
    return true;
  } else {
    return false;
  }
}

function hashPassword(password: string) {
  const hashSalt = 10;
  const hashedPassword = bcrypt.hashSync(password, hashSalt);
  return hashedPassword;
}
