import ReportIndividualCollaboratorScreen from "./screens/ReportIndividualCollaborator";
import reportIndividualCollaboratorApi from "./reportIndividualCollaborator.api";
import * as reportIndividualCollaboratorHook from "./reportIndividualCollaborator.hook";
import * as reportIndividualCollaboratorService from "./reportIndividualCollaborator.service";
import * as reportIndividualCollaboratorModels from "./reportIndividualCollaborator.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportIndividualCollaboratorScreen,
    },
    api : reportIndividualCollaboratorApi,
    hook : reportIndividualCollaboratorHook,
    service : reportIndividualCollaboratorService,
    model : reportIndividualCollaboratorModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;