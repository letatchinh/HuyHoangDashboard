import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/discount`, query),
    getById: (id?: any) => requester.get(`/api/v1/discount/${id}`),
    create: (data?: any) => requester.post(`/api/v1/discount`, data),
    update: (data?: any) => requester.put(`/api/v1/discount/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/discount/${id}`),
}
export default apis;
