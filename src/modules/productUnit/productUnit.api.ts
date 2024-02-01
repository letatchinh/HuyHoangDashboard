import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/unit`, query),
    getAllPublic: () => requester.get(`/api/v1/unit-all`),
    getById: (id?: any) => requester.get(`/api/v1/unit/${id}`),
    create: (data?: any) => requester.post(`/api/v1/unit`, data),
    update: (data?: any) => requester.put(`/api/v1/unit/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/unit/${id}`),
}
export default apis;
