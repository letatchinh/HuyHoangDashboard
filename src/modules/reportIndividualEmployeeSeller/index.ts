import ReportIndividualEmployeeSellerScreen from "./screens/ReportIndividualEmployeeSeller";
import reportIndividualEmployeeSellerApi from "./reportIndividualEmployeeSeller.api";
import * as reportIndividualEmployeeSellerHook from "./reportIndividualEmployeeSeller.hook";
import * as reportIndividualEmployeeSellerService from "./reportIndividualEmployeeSeller.service";
import * as reportIndividualEmployeeSellerModels from "./reportIndividualEmployeeSeller.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportIndividualEmployeeSellerScreen,
    },
    api : reportIndividualEmployeeSellerApi,
    hook : reportIndividualEmployeeSellerHook,
    service : reportIndividualEmployeeSellerService,
    model : reportIndividualEmployeeSellerModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;