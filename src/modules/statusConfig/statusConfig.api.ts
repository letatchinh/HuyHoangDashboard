import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/statusConfig`, query),
    getById: (id?: any) => requester.get(`/api/v1/statusConfig/${id}`),
    create: (data?: any) => requester.post(`/api/v1/statusConfig`, data),
    update: (data?: any) => requester.put(`/api/v1/statusConfig/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/statusConfig/${id}`),
}
export default apis;
