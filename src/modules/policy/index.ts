import PolicyScreen from "./screens/Policy";
import policyApi from "./policy.api";
import * as policyHook from "./policy.hook";
import * as policyService from "./policy.service";
import * as policyModels from "./policy.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : PolicyScreen,
    },
    api : policyApi,
    hook : policyHook,
    service : policyService,
    model : policyModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;