import EmployeeScreen from "./screen/Employee";
import employeeApi from "./employee.api";
import employeeAuth from "./employee.auth";
import * as employeeHook from "./employee.hook";
import employeeService from "./employee.service";
import employeeModels from "./employee.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : EmployeeScreen,
    },
    api : employeeApi,
    auth : employeeAuth,
    hook : employeeHook,
    service : employeeService,
    model : employeeModels,
    redux : {reducer,saga}
};
export default moduleExport;