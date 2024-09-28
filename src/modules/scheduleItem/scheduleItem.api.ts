import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/schedule-item`, query),
    getById: (id?: any) => requester.get(`/api/schedule-item/${id}`),
    create: (data?: any) => requester.post(`/api/schedule-item`, data),
    update: (data?: any) => requester.put(`/api/schedule-item/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/schedule-item/${id}`),
}
export default apis;
