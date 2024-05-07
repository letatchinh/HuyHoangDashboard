import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/product`, query),
    getById: (id?: any) => requester.get(`/api/v1/product/${id}`),
    create: (data?: any) => requester.post(`/api/v1/product`, data),
    update: (data?: any) => requester.put(`/api/v1/product/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/product/${id}`),
    search: ({ optionWith = 'pharmacy', ...query }) => requester.post(`/api/v1/product-search`, { ...query, optionWith }),
    
    getAllBorrow: (query?: any) => requester.get(`/api/v1/borrow-products/fetch`, query),
    getByIdBorrow: (id?: any) => requester.get(`/api/v1/borrow-products/get-one/${id}`),
    createBorrow: (data?: any) => requester.post('/api/v1/borrow-products/create', data),
    updateBorrow: (data?: any) => requester.put(`/api/v1/borrow-products/update/${get(data,'id')}`, omit(data, ['id'])),
    deleteBorrow: (_id?: any) => requester.delete(`/api/v1/borrow-products/delete/${_id}`),
    // confirmBorrow: (data?: any) => requester.post(`/api/v1/borrow-products/confirm/${data?._id}/${data?.status}`),
}
export default apis;
