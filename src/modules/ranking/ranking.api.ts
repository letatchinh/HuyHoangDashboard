import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/ranking`, query),
    getById: (id?: any) => requester.get(`/api/v1/ranking/${id}`),
    create: (data?: any) => requester.post(`/api/v1/ranking`, data),
    update: (data?: any) => requester.put(`/api/v1/ranking/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/ranking/${id}`),
}
export default apis;
