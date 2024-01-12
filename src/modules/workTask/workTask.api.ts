import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/workTask`, query),
    getById: (id?: any) => requester.get(`/api/v1/workTask/${id}`),
    create: (data?: any) => requester.post(`/api/v1/workTask`, data),
    update: (data?: any) => requester.put(`/api/v1/workTask/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/workTask/${id}`),
}
export default apis;
