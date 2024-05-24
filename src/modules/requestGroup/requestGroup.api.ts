import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/request-change-group/fetch-all`, query),
    getByIdPartner: ({id,...param}:any) => requester.get(`/api/v1/request-change-group/fetch-by-partner/${id}`,param),
    create: (data?: any) => requester.post(`/api/v1/request-change-group/create-partner`, data),
    completed: (data?: any) => requester.put(`/api/v1/request-change-group/complete/${get(data,'_id')}`, data),
    processing: (id?: any) => requester.put(`/api/v1/request-change-group/update/${id}`),
    cancel: (id?: any) => requester.delete(`/api/v1/request-change-group/${id}`),
}
export default apis;
