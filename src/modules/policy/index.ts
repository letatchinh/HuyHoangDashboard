import PolicyScreen from "./screens/Policy";
import policyApi from "./policy.api";
import POLICIES, * as policyAuth from "./policy.auth";
import * as policyHook from "./policy.hook";
import * as policyService from "./policy.service";
import * as policyModels from "./policy.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : PolicyScreen,
    },
    api : policyApi,
    auth : policyAuth,
    hook : policyHook,
    service : policyService,
    model : policyModels,
    redux : {reducer,saga},
    POLICIES
};
export default moduleExport;