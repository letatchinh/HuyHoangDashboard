import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/configuration-reportSalary-auto`, query),
    getById: (id?: any) => requester.get(`/api/v1/configuration-reportSalary-auto/${id}`),
    create: (data?: any) => requester.post(`/api/v1/configuration-reportSalary-auto`, data),
    update: (data?: any) => requester.put(`/api/v1/configuration-reportSalary-auto`, data),
    delete: (id?: any) => requester.delete(`/api/v1/configuration-reportSalary-auto/${id}`),
}
export default apis;
