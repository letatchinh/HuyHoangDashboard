import ReportGroupCollaboratorScreen from "./screens/ReportGroupCollaborator";
import reportGroupCollaboratorApi from "./reportGroupCollaborator.api";
import * as reportGroupCollaboratorHook from "./reportGroupCollaborator.hook";
import * as reportGroupCollaboratorService from "./reportGroupCollaborator.service";
import * as reportGroupCollaboratorModels from "./reportGroupCollaborator.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportGroupCollaboratorScreen,
    },
    api : reportGroupCollaboratorApi,
    hook : reportGroupCollaboratorHook,
    service : reportGroupCollaboratorService,
    model : reportGroupCollaboratorModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;