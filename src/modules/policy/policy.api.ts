import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/resource-permission`, query),
    getAllEmployee: (query?: any) => requester.get(`/api/v1/resource-permission-employee`, query),
    getById: (id?: any) => requester.get(`/api/v1/policy/${id}`),
    create: (data?: any) => requester.post(`/api/v1/policy`, data),
    update: ({ groupId, ...rest}: any) => requester.put(`/api/v1/user-group/${groupId}/permission`, { ...rest }),
    delete: ({ groupId, ...rest}: any) => requester.delete(`/api/v1/user-group/${groupId}/permission`, { ...rest }),
}
export default apis;
