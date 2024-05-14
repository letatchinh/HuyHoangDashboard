import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/reportOverview`, query),
    getById: (id?: any) => requester.get(`/api/v1/reportOverview/${id}`),
    getOverview: (data?: any) => requester.post(`api/v1/report-product-overview`, data),
    update: (data?: any) => requester.put(`/api/v1/reportOverview/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/reportOverview/${id}`),
}
export default apis;
