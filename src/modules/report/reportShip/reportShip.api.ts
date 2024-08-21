import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/report-logistic`, query),
    getSummary: (query?: any) => requester.get(`/api/v1/report-logistic-summary`, query),
}
export default apis;
