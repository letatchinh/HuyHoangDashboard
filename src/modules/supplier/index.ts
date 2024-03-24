import SupplierScreen from "./screens/Suppliers";
import supplierApi from "./supplier.api";
import supplierAuth from "./supplier.auth";
import * as supplierHook from "./supplier.hook";
import * as supplierService from "./supplier.service";
import * as supplierModels from "./supplier.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const supplierModule = {
    page : {
        index : SupplierScreen,
    },
    api : supplierApi,
    auth : supplierAuth,
    hook : supplierHook,
    service : supplierService,
    model : supplierModels,
    redux : {reducer,saga},
}
export default supplierModule;