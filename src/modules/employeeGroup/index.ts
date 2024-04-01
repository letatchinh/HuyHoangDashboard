import EmployeeGroupScreen from "./screens/EmployeeGroup";
import employeeGroupApi from "./employeeGroup.api";
import * as employeeGroupAuth from "./employeeGroup.auth";
import * as employeeGroupHook from "./employeeGroup.hook";
import * as employeeGroupService from "./employeeGroup.service";
import * as employeeGroupModels from "./employeeGroup.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : EmployeeGroupScreen,
    },
    api : employeeGroupApi,
    auth : employeeGroupAuth,
    hook : employeeGroupHook,
    service : employeeGroupService,
    model : employeeGroupModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;