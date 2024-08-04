import { EMPLOYEE_LEVEL } from "./constants";

export type EmployeeLevelType = keyof typeof EMPLOYEE_LEVEL;

export type propsType = {
    _id?: string;
    employeeId: string | null
  };