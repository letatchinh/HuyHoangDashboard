import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/staffs`, query),
    getById: (id?: any) => requester.get(`/api/v1/staff/${id}`),
    create: (data?: any) => requester.post(`/api/v1/staff-create`, data),
    update: (data?: any) => requester.put(`/api/v1/staff-update/${get(data,'id')}`, omit(data, ['id'])),
    delete: (id?: any) => requester.delete(`/api/v1/staff/${id}`),
    validateUsername: (query: any) => requester.post(`/api/v1/user/validate-user`, query),
    getPolicy: (query: any) => requester.get(`/api/v1/user-policy`),
}
export default apis;
