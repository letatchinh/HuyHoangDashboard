import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/workList`, query),
    getById: (id?: any) => requester.get(`/api/v1/workList/${id}`),
    create: (data?: any) => requester.post(`/api/v1/workList`, data),
    getListWorkConfig:(query?:any)=> requester.get(`board-config-parent-board/${query?.sprintId}`),
    update: (data?: any) => requester.put(`/api/v1/workList/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/workList/${id}`),
}
export default apis;
