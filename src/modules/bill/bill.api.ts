import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/bill`, query),
    getById: (id?: any) => requester.get(`/api/v1/bill/${id}`),
    create: (data?: any) => requester.post(`/api/v1/bill`, data),
    update: (data?: any) => requester.put(`/api/v1/bill/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/bill/${id}`),
}
export default apis;
