import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/moduleExample`, query),
    getById: (id?: any) => requester.get(`/api/moduleExample/${id}`),
    create: (data?: any) => requester.post(`/api/moduleExample`, data),
    update: (data?: any) => requester.put(`/api/moduleExample/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/moduleExample/${id}`),
}
export default apis;
