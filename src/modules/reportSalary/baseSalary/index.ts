import BaseSalaryScreen from "./screens/BaseSalary";
import baseSalaryApi from "./baseSalary.api";
import * as baseSalaryAuth from "./baseSalary.auth";
import * as baseSalaryHook from "./baseSalary.hook";
import * as baseSalaryService from "./baseSalary.service";
import * as baseSalaryModels from "./baseSalary.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components/index";

const moduleExport = {
    page : {
        index : BaseSalaryScreen,
    },
    api : baseSalaryApi,
    auth : baseSalaryAuth,
    hook : baseSalaryHook,
    service : baseSalaryService,
    model : baseSalaryModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;