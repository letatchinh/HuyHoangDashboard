import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/partner`, query),
    getById: (id?: any) => requester.get(`/api/v1/partner/${id}`),
    create: (data?: any) => requester.post(`/api/v1/partner`, data),
    update: (data?: any) => requester.put(`/api/v1/partner/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/partner/${id}`),
    convert: (data?:any) => requester.put(`/api/v1/partner-convert/${get(data,'_id')}`, data)
}
export default apis;
