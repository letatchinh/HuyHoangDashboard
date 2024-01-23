import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/receiptVoucher`, query),
    getById: (id?: any) => requester.get(`/api/v1/receiptVoucher/${id}`),
    create: (data?: any) => requester.post(`/api/v1/receiptVoucher`, data),
    update: (data?: any) => requester.put(`/api/v1/receiptVoucher/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/receiptVoucher/${id}`),
}
export default apis;
