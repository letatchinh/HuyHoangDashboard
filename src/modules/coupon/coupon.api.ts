import { get } from "lodash";
import requester from "~/api/requester";
import { QuerySearchCoupon, VerifyCoupon } from "./coupon.modal";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/coupon`, query),
    getById: (id?: any) => requester.get(`/api/v1/coupon/${id}`),
    create: (data?: any) => requester.post(`/api/v1/coupon`, data),
    copy: (id?: any) => requester.post(`/api/v1/coupon-copy/${id}`),
    update: (data?: any) => requester.put(`/api/v1/coupon/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/coupon/${id}`),
    search: (payload?: QuerySearchCoupon) => requester.post(`/api/v1/search-coupon`,payload),
    verify: (payload?: VerifyCoupon) => requester.post(`/api/v1/verify-coupon`,payload),
}
export default apis;
