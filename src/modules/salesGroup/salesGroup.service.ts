import { get } from "lodash";
import { FieldTypeForm } from "./salesGroup.modal"

export const service = {
    
}
export const convertSubmitData = (data:FieldTypeForm) => {
    const {managementArea} = data;
    return {
        ...data,
        managementArea : managementArea?.map((option : any) => ({
            path : get(option,'value')
        }))
    }
}

export const convertInitData = (salesGroupInit:any) => {
    const {managementArea} = salesGroupInit;
    return {
        ...salesGroupInit,
        managementArea : managementArea?.map((option : any) => get(option,'path'))
    }
}