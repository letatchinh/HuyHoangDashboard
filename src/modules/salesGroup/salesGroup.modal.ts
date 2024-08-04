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
    _id:                   string;
    managementArea:        any[];
    parents:               string[];
    slug:                  string;
    parentNear?:           string;
    targetSupplier:        any[];
    exchangeRateOverride:  any[];
    parent?:               any;
    salesGroupPermission?: {
        _id:         string;
        mapParent:   string;
        branchId:    number;
        employeeId:  string;
        rule:        "LEADER"|"MEMBER";
        saleGroupId: string;
        __v:         number;
        employee:    any;
        lastSegment: string;
    }[];
    children?: SalesGroupType[];
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

export type BuyGroupType = {
    fullName : string,
    phoneNumber : string,
    avatar : string,
    code : string,
    _id : string,
    children : BuyGroupType[],
    type : 'partner' | 'employee',
    isLeaf?: boolean,
}