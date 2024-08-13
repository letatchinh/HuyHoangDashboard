import { get } from "lodash";

export const DSM_getOptions = (data : any[]) : any[] => data?.map((item: any) => ({ 
    label: `${get(item, "code",'')} - ${get(item, "name","")}`,
    value : get(item,'_id')
 }))