import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/receipt-voucher`, query),
    getById: (id?: any) => requester.get(`/api/v1/receipt-voucher/${id}`),
    create: (data?: any) => requester.post(`/api/v1/receipt-voucher`, data),
    update: (data?: any) => requester.put(`/api/v1/receipt-voucher/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/receipt-voucher/${id}`),
}
export default apis;
