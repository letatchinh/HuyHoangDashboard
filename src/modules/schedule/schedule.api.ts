import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/schedule`, query),
    getListByCourseId: (courseId?: any) => requester.get(`/api/schedules/${courseId}`),
    getById: (id?: any) => requester.get(`/api/schedule-id/${id}`),
    create: (data?: any) => requester.post(`/api/schedule`, data),
    update: (data?: any) => requester.put(`/api/schedule/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/schedule/${id}`),
}
export default apis;
