import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/policy`, query),
    getById: (id?: any) => requester.get(`/api/policy/${id}`),
    create: (data?: any) => requester.post(`/api/policy`, data),
    update: (data?: any) => requester.put(`/api/policy/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/policy/${id}`),
}
export default apis;
