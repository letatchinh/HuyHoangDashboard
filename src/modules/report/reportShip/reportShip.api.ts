import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/report-logitic`, query),
    getSummary: (query?: any) => requester.get(`/api/v1/report-logitic-summary`, query),
}
export default apis;
