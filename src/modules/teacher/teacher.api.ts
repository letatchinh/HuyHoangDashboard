import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/teachers`, query),
    getById: (id?: any) => requester.get(`/api/teacher/${id}`),
    create: (data?: any) => requester.post(`/api/teacher`, data),
    update: (data?: any) => requester.put(`/api/teacher/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/teacher/${id}`),
}
export default apis;
