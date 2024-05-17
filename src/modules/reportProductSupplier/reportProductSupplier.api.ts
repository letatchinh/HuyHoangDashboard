import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/reportProductSupplier`, query),
    getById: (id?: any) => requester.get(`/api/v1/reportProductSupplier/${id}`),
    getListChart: (data?: any) => requester.post(`/api/v1/report-product`, {...data,supplierId : get(data,'supplierId','').split(',')}),
    update: (data?: any) => requester.put(`/api/v1/reportProductSupplier/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/reportProductSupplier/${id}`),
}
export default apis;
