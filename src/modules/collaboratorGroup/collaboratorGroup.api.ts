import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/partner-group`, query),
    getById: (id?: any) => requester.get(`/api/v1/partner-group/${id}`),
    create: (data?: any) => requester.post(`/api/v1/partner-group`, data),
    update: (data?: any) => requester.put(`/api/v1/partner-group/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/partner-group/${id}`),
}
export default apis;
