import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/notification`, query),
    getById: (id?: any) => requester.get(`/api/v1/notification/${id}`),
    create: (data?: any) => requester.post(`/api/v1/notification`, data),
    update: (data?: any) => requester.put(`/api/v1/notification/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/notification/${id}`),
}
export default apis;
