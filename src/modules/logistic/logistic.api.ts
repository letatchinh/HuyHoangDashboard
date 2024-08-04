import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/logistic`, query),
    getById: (id?: any) => requester.get(`/api/v1/logistic/${id}`),
    create: (data?: any) => requester.post(`/api/v1/logistic`, data),
    update: (data?: any) => requester.put(`/api/v1/logistic/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/logistic/${id}`),

    countFee: (body?: any) => requester.post(`/api/v1/services-change`, body),
}
export default apis;
