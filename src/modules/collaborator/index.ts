import CollaboratorScreen from "./screens/index";
import collaboratorApi from "./collaborator.api";
import * as collaboratorAuth from "./collaborator.auth";
import * as collaboratorHook from "./collaborator.hook";
import * as collaboratorService from "./collaborator.service";
import * as collaboratorModels from "./collaborator.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components/CollaboratorForm";

const moduleExport = {
    page : {
        index : CollaboratorScreen,
    },
    api : collaboratorApi,
    auth : collaboratorAuth,
    hook : collaboratorHook,
    service : collaboratorService,
    model : collaboratorModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;