import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/employee-group`, query),
    getById: (id?: any) => requester.get(`/api/v1/employee-group/${id}`),
    create: (data?: any) => requester.post(`/api/v1/employee-group`, data),
    update: (data?: any) => requester.put(`/api/v1/employee-group/${get(data, '_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/employee-group/${id}`),
};
export default apis;
