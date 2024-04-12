import { BaseData } from "~/utils/Modal"
import { EMPLOYEE_LEVEL } from "../employee/constants"
import { EmployeeLevelType } from "../employee/employee.modal"
import { RULE_SALES_GROUP } from "./constants"
import { SALES_GROUP_GEOGRAPHY } from "./constants"
export type propsTypeSalesGroupForm = {
    id? : string,
    parentNear? : string,
    parentNearPath? : string[],
    onCancel : () => void,
    onUpdate: (p: any) => void,
    dataSourceTree : any[]
}
export type TypeAreaType = keyof typeof SALES_GROUP_GEOGRAPHY;
export type FieldTypeForm = {
    name : string,
    alias : string,
    managementArea : string[]
    // typeArea : TypeAreaType,
    parentNear ? : string,

}
export interface SalesGroupType extends BaseData {
    alias : string,
    name : string,
}

export type EmployeeType = {
    employeeLevel : EmployeeLevelType,
    employeeNumber : number,
    fullName : string,
    phoneNumber : string,
    status  : "ACTIVE" | "INACTIVE",
    _id : string,
}
export type MemberRulesInGroupType = {
    employee : EmployeeType,
    employeeId : string,
    rule: keyof typeof RULE_SALES_GROUP,
    name: string
} 