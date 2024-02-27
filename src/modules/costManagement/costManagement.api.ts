import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/shipping-cost`, query),
    getById: (id?: any) => requester.get(`/api/v1/shipping-cost/${id}`),
    create: (data?: any) => requester.post(`/api/v1/shipping-cost`, data),
    update: (data?: any) => requester.put(`/api/v1/shipping-cost}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/shipping-cost/${id}`),
}
export default apis;
