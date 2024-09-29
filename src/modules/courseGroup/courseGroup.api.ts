import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/course-group`, query),
    getById: (id?: any) => requester.get(`/api/course-group/${id}`),
    create: (data?: any) => requester.post(`/api/course-group`, data),
    update: (data?: any) => requester.put(`/api/course-group/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/course-group/${id}`),
}
export default apis;
