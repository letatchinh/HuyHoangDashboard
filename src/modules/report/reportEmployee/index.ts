import ReportEmployeeScreen from "./screens/ReportEmployee";
import reportEmployeeApi from "./reportEmployee.api";
import * as reportEmployeeAuth from "./reportEmployee.auth";
import * as reportEmployeeHook from "./reportEmployee.hook";
import * as reportEmployeeService from "./reportEmployee.service";
import * as reportEmployeeModels from "./reportEmployee.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components/index";

const moduleExport = {
    page : {
        index : ReportEmployeeScreen,
    },
    api : reportEmployeeApi,
    auth : reportEmployeeAuth,
    hook : reportEmployeeHook,
    service : reportEmployeeService,
    model : reportEmployeeModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;