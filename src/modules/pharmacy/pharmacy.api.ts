import { get } from "lodash";
import requester from "~/api/requester";

const pharmacy = {
    getAll: (query?: any) => requester.get(`api/v1/pharma-profile`, query),
    getById: (id?: any) => requester.get(`api/v1/pharma-profile/${id}`,),
    create: (data?: any) => requester.post(`api/v1/pharma-profile`, data),
    update: (data?: any) => requester.put(`api/v1/pharma-profile/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`api/v1/pharma-profile/${id}`),
}
export default pharmacy;
