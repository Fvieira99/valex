import { conflictError } from "../middlewares/errorHandlerMiddleware.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import "dayjs/locale/pt-br.js";

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

export async function createCard(fullName: string) {
  const cardNumber = generateCardNumber();
  const cardHolderName = formatCardHolderName(fullName);
  const expirtationDate = generateFormatedExpirationDate();
  const securityCode = generateCardSecurityCode();

  return {
    cardNumber,
    cardHolderName,
    expirtationDate,
    securityCode
  };
}

function generateCardNumber(): string {
  return faker.finance.creditCardNumber();
}

function formatCardHolderName(fullName: string): string {
  const separatedNameArr = fullName.split(" ");
  const filteredNameArr = separatedNameArr.filter(name => name.length >= 3);
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
  const currentDate = dayjs().locale("pt-br").format("DD/MM/YYYY");

  const [currentMonth, currentYear] = currentDate.split("/").slice(1, 3);

  const expirationYear = calcExpirationDate(currentYear);
  const formatedExpirationYear = expirationYear.toString().slice(2, 5);

  const formatedExpirationDate = `${currentMonth}/${formatedExpirationYear}`;
  return formatedExpirationDate;
}

function generateCardSecurityCode(): string {
  return faker.finance.creditCardCVV();
}

function calcExpirationDate(currentYear: string) {
  const expirationGap = 5;
  return parseInt(currentYear) + expirationGap;
}
