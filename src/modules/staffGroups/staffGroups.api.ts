import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/roles`, query),
    getById: (id?: any) => requester.get(`/api/role/${id}`),
    create: (data?: any) => requester.post(`/api/role`, data),
    update: (data?: any) => requester.put(`/api/role/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/role/${id}`),
}
export default apis;
