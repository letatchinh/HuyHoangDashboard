import { BaseData } from "~/utils/Modal"
import { EMPLOYEE_LEVEL } from "../employee/constants"
import { RULE_SALES_GROUP } from "./constants"
export type propsTypeSalesGroupForm = {
    id? : string,
    parentNear? : string,
    parentNearName? : string,
    parentNearPath? : string[],
    onCancel : () => void,
    onUpdate : (p:any) => void,
}
export type FieldTypeForm = {
    name : string,
    alias : string,
    managementArea : string[]
    typeArea : "REGION" | "GROUP" | "ZONE",
    parentNear ? : string,

}
export interface SalesGroupType extends BaseData {
    alias : string,
    name : string,
}

export type EmployeeType = {
    employeeLevel : keyof typeof EMPLOYEE_LEVEL,
    employeeNumber : number,
    fullName : string,
    phoneNumber : string,
    status  : "ACTIVE" | "INACTIVE",
    _id : string


}
export type MemberRulesInGroupType = {
    employee : EmployeeType,
    employeeId : string,
    rule : keyof typeof RULE_SALES_GROUP,
} 