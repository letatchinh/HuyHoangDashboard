import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/supplier`, query),
    getById: (id?: any) => requester.get(`/api/v1/supplier/${id}`),
    create: (data?: any) => requester.post(`/api/v1/supplier`, data),
    update: (data?: any) => requester.put(`/api/v1/supplier/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/supplier/${id}`),
    getDebt: (id?: any) => requester.delete(`/api/v1/supplier-profile-debt`),
}
export default apis;
