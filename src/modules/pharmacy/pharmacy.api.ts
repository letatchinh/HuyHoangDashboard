import { get, omit } from "lodash";
import requester from "~/api/requester";
import { PropSearchPharmacy, PropSearchPharmacyV2 } from "./pharmacy.modal";

const pharmacy = {
    getAll: (query?: any) => requester.get(`api/v1/pharma-profile`, query),
    getAssign: (query?: any) => requester.get(`api/v1/search-pharmacy`, query),
    search: (query?: PropSearchPharmacy) => requester.post(`api/v1/pharma-profile-search`, query),
    searchV2: (query?: PropSearchPharmacyV2) => requester.post(`api/v2/pharma-profile-search`, query),
    getById: (id?: any) => requester.get(`api/v1/pharma-profile/${id}`),
    getHistoryById: ({id,...query} : any) => requester.get(`api/v1/history-bill-pharma-profile/${id}`,query),
    getHistoryUpdateById: (id?: any) => requester.get(`api/v1/history-pharma-profile/${id}`),
    create: (data?: any) => requester.post(`api/v1/pharma-profile`, data),
    update: (data?: any) => requester.put(`api/v1/pharma-profile/${get(data,'_id')}`, data),
    convert: (data?: any) => requester.put(`api/v1/pharmacy-convert/${get(data,'_id')}`, omit(data, ['_id'])),
    delete: (id?: any) => requester.delete(`api/v1/pharma-profile/${id}`),
    getDebt:(query?: any) => requester.get(`api/v1/pharma-profile-debt`, query),
    getAccumulation: (query?: any) => requester.get(`/api/v1/accumulate-pharma-profile`, query),
    getAccumulationDetail: (query?: any) => requester.get(`/api/v1/accumulate-pharma-profile-detail/${query?.id}`,(omit(query,['id'])))
}
export default pharmacy;
