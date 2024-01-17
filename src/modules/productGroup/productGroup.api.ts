import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/product-group`, query),
    getById: (id?: any) =>  requester.get(`/api/v1/product-group/${id}`),
    create: (data?: any) => requester.post(`/api/v1/product-group`, data),
    update: (data?: any) => requester.put(`/api/v1/product-group/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/product-group/${id}`),
}
export default apis;
