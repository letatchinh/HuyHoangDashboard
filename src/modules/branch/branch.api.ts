import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/branch`, query),
    getListWarehouse: (query?: any) => requester.get(`/api/v1/pms/warehouses`, query),
    getById: (id?: any) => requester.get(`/api/v1/branch/${id}`),
    create: (data?: any) => requester.post(`/api/v1/branch`, data),
    update: (data?: any) => requester.put(`/api/v1/branch/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/branch/${id}`),
    updateApiKey: (data?: any) => requester.put(`/api/v1/branch-apiKey/${get(data,'id')}`, omit(data, ['id'])),
}
export default apis;
