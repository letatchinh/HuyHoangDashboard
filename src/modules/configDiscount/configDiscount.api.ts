import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/configDiscount`),
    getById: (id?: any) => requester.get(`/api/v1/configDiscount/${id}`),
    create: (data?: any) => requester.post(`/api/v1/configDiscount`, data),
    update: (data?: any) => requester.put(`/api/v1/configDiscount`, data),
    delete: (id?: any) => requester.delete(`/api/v1/configDiscount/${id}`),
}
export default apis;
