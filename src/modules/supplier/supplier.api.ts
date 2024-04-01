import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/supplier`, query),
    getTotalRevenue: (query?: any) => requester.get(`/api/v1/supplier-mineral-revenue/${query?.id}`, omit(query,['id'])),
    getListTotalRevenue: (query?: any) => requester.get(`/api/v1/supplier-mineral-revenue/all/${query?.id}`, omit(query,['id'])),
    getById: (id?: any) => requester.get(`/api/v1/supplier/${id}`),
    create: (data?: any) => requester.post(`/api/v1/supplier`, data),
    update: (data?: any) => requester.put(`/api/v1/supplier/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/supplier/${id}`),
    getAllPublic: () => requester.get(`/api/v1/supplier-search`),
    getDebt: (query?: any) => requester.get(`/api/v1/supplier-profile-debt`, query),
    getVouchers: (query?: any) => requester.get(`/api/v1/supplier-voucher-debt`, query),
    getBills: (query?: {supplierId : string}) => requester.get(`/api/v1/supplier-bill`,query),
    getAllAuthorProduct: (query?: any) => requester.get(`/api/v1/search-supplier-product`, query),
    getAllRevenueByIdSupplier: (query?: any) => requester.get(`/api/v1/supplier-revenue/${get(query,'id')}`, omit(query,['id'])),
    updateRevenue: (data?: any) => requester.put(`/api/v1/supplier-revenue-product/${get(data,'supplierId')}`, omit(data,['supplierId'])),
    updateTotalRevenue: (data?: any) => requester.put(`/api/v1/supplier-mineral-revenue/${data?.supplierId} `,  omit(data,['supplierId'])),
    createTotalRevenue: (data?: any) => requester.post(`/api/v1/supplier-mineral-revenue/reset/${data?.supplierId} `, omit(data, ['supplierId'])),

    // This is api for Product groups
    getProductGroupsRevenue: (query?: any) => requester.get(`/api/v1/supplier-revenue-product-group/${query?.id}`, omit(query,['id'])),
    updateProductGroupsRevenue: (query?: any) => requester.put(`/api/v1/supplier-revenue-product-group/${query?.supplierId}`, omit(query,['id'])),
    getTotalProductGroupsAndListProductRevenue: (query?: any) => requester.get(`/api/v1/supplier-revenue-total-product-group`, query),

    //This is api for report
    getReport: (query?: any) => requester.get(`/api/v1/supplier-revenue-time/${query?.id}`, omit(query,['id'])),
    getRanking: () => requester.get(`/api/v1/search/ranking`),
}
export default apis;
