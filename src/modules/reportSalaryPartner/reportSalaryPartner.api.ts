import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/report-salary-partner/fetch`, query),
    getById: (id?: any) => requester.get(`/api/v1/report-salary-partner/${id}`),
    create: (data?: any) => requester.post(`/api/v1/report-salary-partner`, data),
    update: (data?: any) => requester.put(`/api/v1/report-salary-partner/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/report-salary-partner/${id}`),
}
export default apis;
