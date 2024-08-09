import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/report-fee`, query),
    getSummary: (query?: any) => requester.get(`/api/v1/report-fee-summary`, query),
}
export default apis;
