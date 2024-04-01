import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/pharma-mineral-contract`, query),
    getById: (id?: any) => requester.get(`/api/v1/pharma-mineral-contract/${id}`),
    create: (data?: any) => requester.post(`/api/v1/pharma-mineral-contract`, data),
    update: (data?: any) => requester.put(`/api/v1/pharma-mineral-contract/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/pharma-mineral-contract/${id}`),
}
export default apis;
