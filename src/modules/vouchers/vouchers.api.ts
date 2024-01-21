import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/vouchers`, query),
    getById: (id?: any) => requester.get(`/api/v1/vouchers/${id}`),
    create: (data?: any) => requester.post(`/api/v1/vouchers`, data),
    update: (data?: any) => requester.put(`/api/v1/vouchers/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/vouchers/${id}`),
}
export default apis;
