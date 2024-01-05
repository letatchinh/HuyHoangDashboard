import ModuleExampleScreen from "./screens/ModuleExample";
import moduleExampleApi from "./moduleExample.api";
import * as moduleExampleAuth from "./moduleExample.auth";
import * as moduleExampleHook from "./moduleExample.hook";
import * as moduleExampleService from "./moduleExample.service";
import * as moduleExampleModels from "./moduleExample.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : ModuleExampleScreen,
    },
    api : moduleExampleApi,
    auth : moduleExampleAuth,
    hook : moduleExampleHook,
    service : moduleExampleService,
    model : moduleExampleModels,
    redux : {reducer,saga}
};
export default moduleExport;