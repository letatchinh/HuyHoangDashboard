import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/medicine`, query),
    getById: (id?: any) => requester.get(`/api/v1/medicine/${id}`),
    create: (data?: any) => requester.post(`/api/v1/medicine`, data),
    update: (data?: any) => requester.put(`/api/v1/medicine/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/medicine/${id}`),
}
export default apis;
