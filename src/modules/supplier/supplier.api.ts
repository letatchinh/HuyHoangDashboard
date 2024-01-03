import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/wh-service`, query),
    getById: (id?: any) => requester.get(`/api/v1/wh-service`, id),
}
export default apis;
