import ReportSupplierScreen from "./screens/ReportSupplier";
import reportSupplierApi from "./reportSupplier.api";
import * as reportSupplierAuth from "./reportSupplier.auth";
import * as reportSupplierHook from "./reportSupplier.hook";
import * as reportSupplierService from "./reportSupplier.service";
import * as reportSupplierModels from "./reportSupplier.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : ReportSupplierScreen,
    },
    api : reportSupplierApi,
    auth : reportSupplierAuth,
    hook : reportSupplierHook,
    service : reportSupplierService,
    model : reportSupplierModels,
    redux : {reducer,saga}
};
export default moduleExport;