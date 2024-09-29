import { get } from "lodash";
import requester from "~/api/requester";
import { permissionResources } from "./policy.modal";

const apis = {
    getAll: (query?: any) => requester.get(`/api/policy`, query),
    getById: (id?: any) => requester.get(`/api/policy/${id}`),
    update: (data?: any) => requester.put(`/api/policy/${get(data,'id')}`, data),
    deletePermission: (body?: permissionResources) => requester.delete(`/api/policy-resource`, body),
    createPermission: (data?: permissionResources) => requester.post(`/api/policy-resource`, data),
    getByStaffGroup: (id?: any) => requester.delete(`/api/policy-resource/${id}`),
    
    getByUserLoginResource: () => requester.get(`/api/user-resource`),
    getResources: (query?: any) => requester.get(`/api/v2/resource-permission`, query),
}
export default apis;
