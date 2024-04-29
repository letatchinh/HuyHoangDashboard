import { get } from "lodash";
import requester from "~/api/requester";
import { PayloadSubmitUpdateAddressPartner } from "./collaborator.modal";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/partner`, query),
    searchProduct: (query?: any) => requester.post(`/api/v1/product-search-assign-partner`, query),
    addProduct: (query?: any) => requester.put(`/api/v1/partner-add-product`, query),
    updateProduct: (query?: any) => requester.put(`/api/v1/partner-update-discount-product`, query),
    updateAddress: ({id,...query}: PayloadSubmitUpdateAddressPartner) => requester.put(`/api/v1/partner-update-addressStories/${id}`, query),
    removeProduct: (query?: any) => requester.delete(`/api/v1/partner-remove-product`, query),
    getById: (id?: any) => requester.get(`/api/v1/partner/${id}`),
    create: (data?: any) => requester.post(`/api/v1/partner`, data),
    update: (data?: any) => requester.put(`/api/v1/partner/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/partner/${id}`),
    convert: (data?:any) => requester.put(`/api/v1/partner-convert/${get(data,'_id')}`, data),
    getALLAuthenticated: (query?: any) => requester.get(`/api/v1/partner-authenticated`, query),
}
export default apis;
