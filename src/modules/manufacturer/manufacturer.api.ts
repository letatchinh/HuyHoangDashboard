import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/manufacturer`, query),
    getById: (id?: any) => requester.get(`/api/v1/manufacturer`, id),
    create: (data?: any) => requester.post(`/api/v1/manufacturer`, data),
    update: (data?: any) => requester.put(`/api/v1/manufacturer/${get(data,'_id')}`, data),
    delete: (id?: any) => {
        console.log(id);
       return requester.delete(`/api/v1/product-config/${id}`)},
}
export default apis;
