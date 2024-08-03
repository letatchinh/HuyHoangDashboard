import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/order-supplier-list`, query),
    getById: (id?: any) => requester.get(`/api/v1/order-supplier/${id}`),
    create: (data?: any) => requester.post(`/api/v1/order-supplier-create`, data),
    update: (data?: any) => requester.put(`/api/v1/order-supplier-update/${get(data, '_id')}`, data),
    
    createBillInWarehouse: (data?: any) => requester.post(`/api/v1/pms/purchase-order-quotation/create`, data),
    updateStatusBillWarehouse: (data?: any) => requester.put(`api/v1/order-supplier-status/${get(data, 'id')}`, omit(data, ["id"])),
}
export default apis;
