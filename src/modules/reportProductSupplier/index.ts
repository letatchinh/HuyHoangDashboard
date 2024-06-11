import ReportProductSupplierScreen from "./screens/ReportProductSupplier";
import reportProductSupplierApi from "./reportProductSupplier.api";
import * as reportProductSupplierAuth from "./reportProductSupplier.auth";
import * as reportProductSupplierHook from "./reportProductSupplier.hook";
import * as reportProductSupplierService from "./reportProductSupplier.service";
import * as reportProductSupplierModels from "./reportProductSupplier.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportProductSupplierScreen,
    },
    api : reportProductSupplierApi,
    auth : reportProductSupplierAuth,
    hook : reportProductSupplierHook,
    service : reportProductSupplierService,
    model : reportProductSupplierModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;