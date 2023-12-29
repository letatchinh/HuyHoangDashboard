import BranchScreen from "./screens/Branch";
import branchApi from "./branch.api";
import branchAuth from "./branch.auth";
import * as branchHook from "./branch.hook";
import branchService from "./branch.service";
import branchModels from "./branch.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : BranchScreen,
    },
    api : branchApi,
    auth : branchAuth,
    hook : branchHook,
    service : branchService,
    model : branchModels,
    redux : {reducer,saga}
};
export default moduleExport;