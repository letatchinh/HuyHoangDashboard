import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/product-shipping-cost`, query),
    getById: (query?: any) => requester.get(`/api/v1/product-shipping-cost/${get(query,'id', '')}`, omit(query,'id')),
    // getById: (query?: any) => requester.get(`/api/v1/product-shipping-cost/${get(query,'id')}`, omit(query,'id')),
    create: (data?: any) => requester.post(`/api/v1/shipping-cost`, data),
    update: (data?: any) => requester.put(`/api/v1/shipping-cost/${get(data,'_id')}`,  omit(data,'_id')),
    delete: (id?: any) => requester.delete(`/api/v1/shipping-cost/${id}`),
}
export default apis;
