import requester from "~/api/requester";

const apis = {
  getAll: () => requester.get("/api/v1/country"),
}
export default apis;
