import RequestGroupScreen from "./screens/RequestGroup";
import requestGroupApi from "./requestGroup.api";
import * as requestGroupHook from "./requestGroup.hook";
import * as requestGroupService from "./requestGroup.service";
import * as requestGroupModels from "./requestGroup.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : RequestGroupScreen,
    },
    api : requestGroupApi,
    hook : requestGroupHook,
    service : requestGroupService,
    model : requestGroupModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;