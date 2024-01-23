import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/payment-voucher`, query),
    getById: (id?: any) => requester.get(`/api/v1/payment-voucher/${id}`),
    create: (data?: any) => requester.post(`/api/v1/payment-voucher`, data),
    update: (data?: any) => requester.put(`/api/v1/payment-voucher/${get(data,'_id')}`, data),
    confirm: (data?: any) => requester.put(`/api/v1/payment-voucher/${get(data,'id')}/${get(data,'status')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/payment-voucher/${id}`),
}
export default apis;
