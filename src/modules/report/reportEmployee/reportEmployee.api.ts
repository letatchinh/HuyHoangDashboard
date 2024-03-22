import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/report-salary-list`, query),
    getById: (id?: any) => requester.get(`/api/v1/report-salary/${id}`),
    create: (data?: any) => requester.post(`/api/v1/reportEmployee`, data),
    update: (data?: any) => requester.put(`/api/v1/report-salary-update-save/${get(data,'_id')}`, data),
    updatePreview: (data?: any) => requester.put(`/api/v1/report-salary-update-preview/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/reportEmployee/${id}`),
}
export default apis;
