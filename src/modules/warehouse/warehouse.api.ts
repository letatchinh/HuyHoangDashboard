import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/pms/warehouse/list`, query),
    getById: (id?: any) => requester.get(`/api/v1/branch/warehouse-address/${id}`),
    create: (data?: any) => requester.post(`/api/v1/warehouse`, data),
    checkWarehouse: (data?: any) => requester.post(`/api/v1/pms/warehouses/check-product`, data),
    update: (data?: any) => requester.put(`/api/v1/warehouse/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/warehouse/${id}`),
    
    createBillToWarehouse: (data?: any) => requester.post(`/api/v1/pms/warehouses/create-sale-order`, data),
    updateManagementWarehouse: (data?: any) => requester.put(`/api/v1/branch/warehouse-address/${get(data,'branchId')}`, omit(data, ['branchId'])),
    getAllWarehouse: (id?: any) => requester.get(`/api/v1/branch/warehouses/${id}`),
    deleteWarehouseLink: (data?: any) => requester.delete(`/api/v1/branch/warehouse/${data?.id}`, omit(data, ['id'])),
}
export default apis;