import PolicyScreen from "./screens/Policy";
import policyApi from "./policy.api";
import * as policyHook from "./policy.hook";
import * as policyService from "./policy.service";
import * as policyModels from "./policy.modal";
import components from "./components";
export * from "./redux";

const moduleExport = {
    page : {
        index : PolicyScreen,
    },
    api : policyApi,
    hook : policyHook,
    service : policyService,
    model : policyModels,
    components,
};
export default moduleExport;