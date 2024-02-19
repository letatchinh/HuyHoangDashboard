import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/todo-status-config`, query),
    getById: (id?: any) => requester.get(`/api/v1/todo-status-config/${id}`),
    create: (data?: any) => requester.post(`/api/v1/todo-status-config`, data),
    update: (data?: any) => requester.put(`/api/v1/todo-status-config/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/todo-status-config/${id}`),
}
export default apis;
