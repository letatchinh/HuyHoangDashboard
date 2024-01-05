import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/employee`, query),
    getById: (id?: any) => requester.get(`/api/v1/employee/${id}`),
    create: (data?: any) => requester.post(`/api/v1/employee`, data),
    update: (data?: any) => requester.put(`/api/v1/employee/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/employee/${id}`),
}
export default apis;
