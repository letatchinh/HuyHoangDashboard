import branchApi from "./branch.api";
import branchAuth from "./branch.auth";
import * as branchHook from "./branch.hook";
import branchService from "./branch.service";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import * as branchModals from "./branch.modal";
import { BranchProviderContext } from "./store/BranchContext";
import BranchRoot from "./screens";

const moduleExport = {
    page : {
        index : BranchRoot,
    },
    api : branchApi,
    auth : branchAuth,
    hook : branchHook,
    service : branchService,
    model : branchModals,
    redux: { reducer, saga },
    storeProvider: {
        BranchProviderContext
    }
};
export default moduleExport;