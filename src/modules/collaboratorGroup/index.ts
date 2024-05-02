import CollaboratorGroupScreen from "./screens/CollaboratorGroup";
import collaboratorGroupApi from "./collaboratorGroup.api";
import * as collaboratorGroupAuth from "./collaboratorGroup.auth";
import * as collaboratorGroupHook from "./collaboratorGroup.hook";
import * as collaboratorGroupService from "./collaboratorGroup.service";
import * as collaboratorGroupModels from "./collaboratorGroup.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : CollaboratorGroupScreen,
    },
    api : collaboratorGroupApi,
    auth : collaboratorGroupAuth,
    hook : collaboratorGroupHook,
    service : collaboratorGroupService,
    model : collaboratorGroupModels,
    redux : {reducer,saga},
};
export default moduleExport;