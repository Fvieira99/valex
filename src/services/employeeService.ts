import {
  notFoundError,
  unauthorizedError
} from "../middlewares/errorHandlerMiddleware.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";

export async function verifyEmployeeAndCompany(
  employeeId: number,
  apiKey: string
) {
  const employee = await employeeRepository.findById(employeeId);
  if (!employee) {
    throw notFoundError();
  }

  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) {
    throw notFoundError();
  }

  if (employee.companyId !== company.id) {
    throw unauthorizedError();
  }

  return employee.fullName;
}
