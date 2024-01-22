import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/billQuotations`, query),
    getById: (id?: any) => requester.get(`/api/v1/billQuotation/${id}`),
    create: (data?: any) => requester.post(`/api/v1/billQuotation-create`, data),
    update: (data?: any) => requester.put(`/api/v1/billQuotation-update/${get(data,'_id')}`, data),
    convert: (data?: any) => requester.post(`/api/v1/billQuotation-convert/${get(data,'_id')}`,data),
    delete: (id?: any) => requester.delete(`/api/v1/billQuotation/${id}`),
}
export default apis;
