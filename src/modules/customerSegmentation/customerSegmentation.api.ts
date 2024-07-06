import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/customer-division`, query),
    getById: (id?: any) => requester.get(`/api/v1/customer-division/${id}`),
    create: (data?: any) => requester.post(`/api/v1/customer-division`, data),
    update: (data?: any) => requester.put(`/api/v1/customer-division/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/customer-division/${id}`),
}
export default apis;
