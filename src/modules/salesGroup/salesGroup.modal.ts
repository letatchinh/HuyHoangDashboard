import { BaseData } from "~/utils/Modal"

export type propsTypeSalesGroupForm = {
    id? : string,
    onCancel : () => void,
    onUpdate : (p:any) => void,
}
export type FieldTypeForm = {
    name : string,
    alias : string,
    managementArea : string[]
    typeArea : "REGION" | "GROUP",

}
export interface SalesGroupType extends BaseData {
    alias : string,
    name : string,
}