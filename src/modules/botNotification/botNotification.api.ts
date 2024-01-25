import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/notify-account`, query),
    create: (data?: any) => requester.post(`/api/v1/update-notify-account`, data),
}
export default apis;
