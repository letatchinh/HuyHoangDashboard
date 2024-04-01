import SalesGroupScreen from "./screens/SalesGroup";
import salesGroupApi from "./salesGroup.api";
import * as salesGroupAuth from "./salesGroup.auth";
import * as salesGroupHook from "./salesGroup.hook";
import * as salesGroupService from "./salesGroup.service";
import * as salesGroupModels from "./salesGroup.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components/index";

const moduleExport = {
    page : {
        index : SalesGroupScreen,
    },
    api : salesGroupApi,
    auth : salesGroupAuth,
    hook : salesGroupHook,
    service : salesGroupService,
    model : salesGroupModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;