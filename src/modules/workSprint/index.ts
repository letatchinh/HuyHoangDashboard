import WorkSprintScreen from "./screens/WorkSprint";
import workSprintApi from "./workSprint.api";
import * as workSprintAuth from "./workSprint.auth";
import * as workSprintHook from "./workSprint.hook";
import * as workSprintService from "./workSprint.service";
import * as workSprintModels from "./workSprint.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : WorkSprintScreen,
    },
    api : workSprintApi,
    auth : workSprintAuth,
    hook : workSprintHook,
    service : workSprintService,
    model : workSprintModels,
    redux : {reducer,saga}
};
export default moduleExport;