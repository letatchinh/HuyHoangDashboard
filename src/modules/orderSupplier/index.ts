import OrderSupplierScreen from "./screens/OrderSupplier";
import orderSupplierApi from "./orderSupplier.api";
import * as orderSupplierAuth from "./orderSupplier.auth";
import * as orderSupplierHook from "./orderSupplier.hook";
import * as orderSupplierService from "./orderSupplier.service";
import * as orderSupplierModels from "./orderSupplier.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : OrderSupplierScreen,
    },
    api : orderSupplierApi,
    auth : orderSupplierAuth,
    hook : orderSupplierHook,
    service : orderSupplierService,
    model : orderSupplierModels,
    redux : {reducer,saga}
};
export default moduleExport;