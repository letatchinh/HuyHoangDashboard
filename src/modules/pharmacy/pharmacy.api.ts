import { get, omit } from "lodash";
import requester from "~/api/requester";

const pharmacy = {
    getAll: (query?: any) => requester.get(`api/v1/pharma-profile`, query),
    getAssign: (query?: any) => requester.get(`api/v1/search-pharmacy`, query),
    search: (query?: any) => requester.post(`api/v1/pharma-profile-search`, query),
    getById: (id?: any) => requester.get(`api/v1/pharma-profile/${id}`),
    getHistoryById: (id?: any) => requester.get(`api/v1/history-bill-pharma-profile/${id}`),
    create: (data?: any) => requester.post(`api/v1/pharma-profile`, data),
    update: (data?: any) => requester.put(`api/v1/pharma-profile/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`api/v1/pharma-profile/${id}`),
    getDebt:(query?: any) => requester.get(`api/v1/pharma-profile-debt`, query),
    getAccumulation: (query?: any) => requester.get(`/api/v1/accumulate-pharma-profile`, query),
    getAccumulationDetail: (query?: any) => requester.get(`/api/v1/accumulate-pharma-profile-detail/${query?.id}`,(omit(query,['id'])))
}
export default pharmacy;
