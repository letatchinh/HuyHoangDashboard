import OrderSupplierScreen from "./screens/OrderSupplier";
import orderSupplierApi from "./orderSupplier.api";
import * as orderSupplierAuth from "./orderSupplier.auth";
import * as orderSupplierHook from "./orderSupplier.hook";
import * as orderSupplierService from "./orderSupplier.service";
import * as orderSupplierModels from "./orderSupplier.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import SaleScreen from "./components/createOrderSupplierScreen/SaleScreen";
import { CreateOrderSupplierProvider } from "./storeContext/CreateOrderSupplierContext";
import components from "./components";

const moduleExport = {
    page : {
        index : OrderSupplierScreen,
        create : SaleScreen
    },
    api : orderSupplierApi,
    auth : orderSupplierAuth,
    hook : orderSupplierHook,
    service : orderSupplierService,
    model : orderSupplierModels,
    redux : {reducer,saga},
    storeProvider : {
        CreateOrderSupplier : CreateOrderSupplierProvider
    },
    components
};
export default moduleExport;