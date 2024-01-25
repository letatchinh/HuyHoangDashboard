import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/update-notify-account`, query),
    create: (data?: any) => requester.post(`/api/v1/botNotification`, data),
}
export default apis;
