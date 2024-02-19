import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/reportSupplier`, query),
    getById: (id?: any) => requester.get(`/api/v1/reportSupplier/${id}`),
}
export default apis;
