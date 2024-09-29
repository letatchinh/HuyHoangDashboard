import { get, omit } from "lodash";
import requester from "~/api/requester";
import { permissionResources } from "./policy.modal";

const apis = {
    getAll: (query?: any) => requester.get(`/api/policy`, query),
    getById: (id?: any) => requester.get(`/api/resource-by-role/${id}`),
    update: (data?: any) => requester.put(`/api/policy/${get(data,'id')}`, data),
    deletePermission: (body?: permissionResources) => requester.delete(`/api/policy-resource/${body?.roleId}`, omit(body, 'roleId')),
    createPermission: (body?: permissionResources) => requester.post(`/api/policy-resource/${body?.roleId}`, omit(body, 'roleId')),
    getByStaffGroup: (id?: any) => requester.delete(`/api/policy-resource/${id}`),
    
    getByUserLoginResource: () => requester.get(`/api/user-resource`),
    getResources: (query?: any) => requester.get(`/api/resource-permission`, query),
}
export default apis;
