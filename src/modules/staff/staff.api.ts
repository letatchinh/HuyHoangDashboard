import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/staffs`, query),
    getById: (id?: any) => requester.get(`/api/staff/${id}`),
    create: (data?: any) => requester.post(`/api/staff`, data),
    update: (data?: any) => requester.put(`/api/staff/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/staff/${id}`),
}
export default apis;
