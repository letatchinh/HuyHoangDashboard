import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/user`, query),
    getById: (id?: any) => requester.get(`/api/v1/user`, id),
    create: (data?: any) => requester.post(`/api/v1/user`, data),
    update: (data?: any) => requester.put(`/api/v1/user/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/user/${id}`),
    validateUsername: (query: any) => requester.get(`/api/v1/user/validate-user`, query),
}
export default apis;
