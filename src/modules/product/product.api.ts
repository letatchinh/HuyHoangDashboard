import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/product`, query),
    getById: (id?: any) => requester.get(`/api/v1/product/${id}`),
    create: (data?: any) => requester.post(`/api/v1/product`, data),
    update: (data?: any) => requester.put(`/api/v1/product/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/product/${id}`),
    search : (query?: any) => requester.post(`/api/v1/product-search`, query),
}
export default apis;
