import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/manufacturer`, query),
    getAllPublic: () => requester.get(`/api/v1/manufacturer-all`),
    getById: (id?: any) => requester.get(`/api/v1/manufacturer/${id}`),
    create: (data?: any) => requester.post(`/api/v1/manufacturer`, data),
    update: (data?: any) => requester.put(`/api/v1/manufacturer/${get(data,'id')}`, data),
    delete: (id?: any) => {
       return requester.delete(`/api/v1/manufacturer/${id}`)},
}
export default apis;
