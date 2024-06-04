import ReportGroupEmployeeSellerScreen from "./screens/ReportGroupEmployeeSeller";
import reportGroupEmployeeSellerApi from "./reportGroupEmployeeSeller.api";
import * as reportGroupEmployeeSellerHook from "./reportGroupEmployeeSeller.hook";
import * as reportGroupEmployeeSellerService from "./reportGroupEmployeeSeller.service";
import * as reportGroupEmployeeSellerModels from "./reportGroupEmployeeSeller.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportGroupEmployeeSellerScreen,
    },
    api : reportGroupEmployeeSellerApi,
    hook : reportGroupEmployeeSellerHook,
    service : reportGroupEmployeeSellerService,
    model : reportGroupEmployeeSellerModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;