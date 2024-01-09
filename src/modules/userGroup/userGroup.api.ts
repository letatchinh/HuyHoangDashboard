import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/user-group`, query),
    getById: (param?: any) => requester.get(`/api/v1/user-group/${param}`),
    create: (data?: any) => requester.post(`/api/v1/user-group`, data),
    update: (data?: any) => requester.put(`/api/v1/user-group/${get(data, '_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/user-group/${id}`),
};
export default apis;
