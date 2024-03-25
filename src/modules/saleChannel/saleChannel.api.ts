import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/sales-channel`, query),
    getById: (id?: any) => requester.get(`/api/v1/sales-channel/${id}`),
    create: (data?: any) => requester.post(`/api/v1/sales-channel`, data),
    update: (data?: any) => requester.put(`/api/v1/sales-channel/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/sales-channel/${id}`),
}
export default apis;
