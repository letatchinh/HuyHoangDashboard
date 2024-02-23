import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/export`, query),
    getById: (id?: any) => requester.get(`/api/v1/export/${id}`),
    create: (data?: any) => requester.post(`/api/v1/export`, data),
    update: (data?: any) => requester.put(`/api/v1/export/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/export/${id}`),
}
export default apis;
