import auth from "~/modules/auth";
import branch from "~/modules/branch";
import geo from "~/modules/geo";

const apis = {
    auth : auth.api,
    branch : branch.api,
    geo : geo.api,
}
export default apis;

