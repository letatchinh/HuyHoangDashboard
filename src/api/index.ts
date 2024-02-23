import auth from "~/modules/auth";
import branch from "~/modules/branch";
import geo from "~/modules/geo";
import country from "./country";

const api = {
    auth : auth.api,
    branch : branch.api,
    geo : geo.api,
    country
}
export default api;

