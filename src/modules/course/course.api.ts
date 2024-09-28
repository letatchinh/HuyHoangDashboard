import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/course`, query),
    getById: (id?: any) => requester.get(`/api/course-id/${id}`),
    create: (data?: any) => requester.post(`/api/course`, data),
    update: (data?: any) => requester.put(`/api/course/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/course/${id}`),
}
export default apis;
