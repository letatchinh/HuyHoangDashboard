import auth from "~/modules/auth";
import branch from "~/modules/branch";
import geo from "~/modules/geo";
import workTask from "~/modules/workTask";
const apis = {
    auth : auth.api,
    branch : branch.api,
    geo : geo.api,
    workTask : workTask.api
}
export default apis;

