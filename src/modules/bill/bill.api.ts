import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/bill`, query),
    getById: (id?: any) => requester.get(`/api/v1/bill-id/${id}`),
    create: (data?: any) => requester.post(`/api/v1/bill-create`, data),
    update: (data?: any) => requester.put(`/api/v1/bill/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/bill/${id}`),
    verify: (data?: {billSample : {productId : string,variantId : string}[]}) => requester.post(`/api/v1/bill-sample`, data),
    getDiscount: (data?: any) => requester.post(`/api/v1/bill-valid-discount`, data),
    getDebtRule: () => requester.get(`/api/v1/debt-rule`),
    getListProductSuggest: (query?: any) => requester.get(`/api/v1/bill-product-suggest`, query),
}
export default apis;
