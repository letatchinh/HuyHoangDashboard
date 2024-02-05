import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/product`, query),
    getById: (id?: any) => requester.get(`/api/v1/productsAll/${id}`),
    create: (data?: any) => requester.post(`/api/v1/productsAll`, data),
    update: (data?: any) => requester.put(`/api/v1/productsAll/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/productsAll/${id}`),
}
export default apis;
