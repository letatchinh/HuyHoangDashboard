import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/warehouse`, query),
    getById: (id?: any) => requester.get(`/api/v1/warehouse/${id}`),
    create: (data?: any) => requester.post(`/api/v1/warehouse`, data),
    update: (data?: any) => requester.put(`/api/v1/warehouse/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/warehouse/${id}`),

    getAllWarehouse: (query?: any) => requester.get(`/api/v1/branch/warehouses/${get(query,'branchId')}`, query),
}
export default apis;
