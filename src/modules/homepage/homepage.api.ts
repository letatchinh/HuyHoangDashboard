import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/homepage`, query),
    getById: (id?: any) => requester.get(`/api/v1/homepage/${id}`),
    create: (data?: any) => requester.post(`/api/v1/homepage`, data),
    update: (data?: any) => requester.put(`/api/v1/homepage/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/homepage/${id}`),
}
export default apis;
