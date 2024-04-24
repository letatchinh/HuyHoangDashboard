import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    subscribeToken: (token: any) => requester.post(`/api/v1/devices_fcm`,{token}),
    unSubscribeToken: (token: any) => requester.delete(`/api/v1/devices_fcm`,{token}),
    getMyNotification : (query: any) => requester.get(`/api/v1/notifications`,query),
    updateStatus : ({id,status}: any) => requester.put(`/api/v1/notifications/${id}`,{status}),
    updateManyStatus : ({ids,status}: any) => requester.put(`/api/v1/notifications-many-status`,{ids,status}),
    updateAllToRead : () => requester.put(`/api/v1/notifications-status-read`),
}
export default apis;
