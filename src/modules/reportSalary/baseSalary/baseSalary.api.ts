import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/configuration-baseSalary`, query),
    getById: (id?: any) => requester.get(`/api/v1/baseSalary/${id}`),
    create: (data?: any) => requester.post(`/api/v1/baseSalary`, data),
    update: (data?: any) => requester.put(`/api/v1/configuration-baseSalary`, data),
    delete: (id?: any) => requester.delete(`/api/v1/baseSalary/${id}`),
}
export default apis;
