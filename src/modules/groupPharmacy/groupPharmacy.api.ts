import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/customer`, query),
    getById: (id?: any) => requester.get(`/api/v1/customer/${id}`),
    create: (data?: any) => requester.post(`/api/v1/customer`, data),
    update: (data?: any) => requester.put(`/api/v1/customer/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/customer/${id}`),
    search: (query?: any) => requester.get(`/api/v1/customer-search`, query),
}
export default apis;
