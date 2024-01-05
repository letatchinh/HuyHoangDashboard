import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/staffs`, query),
    getById: (id?: any) => requester.get(`/api/v1/staffs`, id),
    create: (data?: any) => requester.post(`/api/v1/staff-create`, data),
    update: (data?: any) => requester.put(`/api/v1/staff-update/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/staffs/${id}`),
    validateUsername: (query: any) => requester.get(`/api/v1/staffs/validate-staffs`, query),
}
export default apis;
