import { BaseData } from "~/utils/Modal"

export type propsTypeAreaConfigurationForm = {
    id? : string,
    onCancel : () => void,
    onUpdate : (p:any) => void,
}
export type FieldTypeForm = {
    name : string,
    alias : string,
    
}
export interface AreaConfigurationType extends BaseData {
    alias : string,
    name : string,
    areaManages : any[]
}