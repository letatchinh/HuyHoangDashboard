import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/employee`, query),
    getById: (id?: any) => requester.get(`/api/v1/employee/${id}`),
    create: (data?: any) => requester.post(`/api/v1/employee`, data),
    update: (data?: any) => requester.put(`/api/v1/employee/${get(data ,'_id' , 'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/employee/${id}`),
    getALLAuthenticated: (query?: any) => requester.get('/api/v1/employee-all', query),
    searchProduct : (query : any) => requester.post(`/api/v1/product-search-assign-employee`,query),
    addProduct: (query?: any) => requester.put(`/api/v1/employee-add-product`, query),
    updateProduct: (query?: any) => requester.put(`/api/v1/employee-update-discount-product`, query),
    removeProduct: (query?: any) => requester.delete(`/api/v1/employee-remove-product`, query),
    search: (query?: any) => requester.get(`/api/v1/employee-assign-pharmacy-search`, query),
}
export default apis;
