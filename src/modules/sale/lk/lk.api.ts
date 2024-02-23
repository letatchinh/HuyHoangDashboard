import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.post(`/api/v1/cumulative_discount_event`, query),
}
export default apis;
