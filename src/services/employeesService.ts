import { notFoundError } from "../middlewares/errorHandlerMiddleware.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

export async function checkIfEmployeeExists(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);
  if (!employee) {
    throw notFoundError();
  }
  const { fullName } = employee;

  return fullName;
}
