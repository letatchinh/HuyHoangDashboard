import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/configuration-cronTime`, query),
    // getById: (id?: any) => requester.get(`/api/v1/configurationCronTime/${id}`),
    // create: (data?: any) => requester.post(`/api/v1/configurationCronTime`, data),
    update: (data?: any) => requester.put(`/api/v1/configuration-cronTime-create-order/update/${get(data,'_id')}`, data),
    // delete: (id?: any) => requester.delete(`/api/v1/configurationCronTime/${id}`),
}
export default apis;
