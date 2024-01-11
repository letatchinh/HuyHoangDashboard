import requester from "~/api/requester";

const apis = {
  getAll: () => requester.get("/country"),
}
export default apis;
