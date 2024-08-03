import { get, omit } from "lodash";
import requester from "~/api/requester";
import { PayloadUpdateBill } from "./bill.modal";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/bill`, query),
    getById: (id?: any) => requester.get(`/api/v1/bill-id/${id}`),
    create: (data?: any) => requester.post(`/api/v1/bill-create`, data),
    update: (data?: PayloadUpdateBill) => requester.put(`/api/v1/bill-update/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/bill/${id}`),
    verifyBill: (data?: {billSample : {productId : string,variantId : string}[],pharmacyId? : any}) => requester.post(`/api/v1/bill-sample`, data),
    getDiscount: ({saleType = 'pharmacy',...data}) => requester.post(`/api/v1/bill-valid-discount?saleType=${saleType}`, data),
    getDebtRule: () => requester.get(`/api/v1/debt-rule`),
    getListProductSuggest: (query?: any) => requester.get(`/api/v1/bill-product-suggest`, query),
    getBillToReceiptVoucher: (id?: any) => requester.get(`/api/v1/bills-of-pharmacy/${id}`),

    updateApplyLogisticUnit: (data: any) => requester.put(`/api/v1/bill-transport-unit/${data?.id}`, omit(data, ["id"])),
    updateStatusBill: (data: any) => requester.put(`/api/v1/bill-status/${data?.billId}`, omit(data, ["billId"])),
    splitBill: (data?: any) => requester.post(`/api/v1/bill-split`, data),
}
export default apis;
