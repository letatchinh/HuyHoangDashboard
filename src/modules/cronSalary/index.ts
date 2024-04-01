import CronSalaryScreen from "./screens/CronSalary";
import cronSalaryApi from "./cronSalary.api";
import * as cronSalaryAuth from "./cronSalary.auth";
import * as cronSalaryHook from "./cronSalary.hook";
import * as cronSalaryService from "./cronSalary.service";
import * as cronSalaryModels from "./cronSalary.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : CronSalaryScreen,
    },
    api : cronSalaryApi,
    auth : cronSalaryAuth,
    hook : cronSalaryHook,
    service : cronSalaryService,
    model : cronSalaryModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;