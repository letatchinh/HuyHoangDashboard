import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/receipt-voucher`, query),
    getAllByBillId: (query?: any) => requester.get(`/api/v1/receipt-voucher-bill-item/${get(query,'billId')}`, omit(query,'billId')),
    getById: (id?: any) => requester.get(`/api/v1/receipt-voucher/${id}`),
    create: (data?: any) => requester.post(`/api/v1/receipt-voucher`, data),
    update: (data?: any) => requester.put(`/api/v1/receipt-voucher/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/receipt-voucher/${id}`),
    confirm: (data?: any) => requester.put(`/api/v1/receipt-voucher/${get(data, 'id')}/${get(data, 'status')}`),
    postIssueNumber: (data?: any) => requester.post('/api/v1/general-issue-number', data),
}
export default apis;
