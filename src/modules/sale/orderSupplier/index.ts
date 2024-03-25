import OrderSupplierScreen from "./screens/OrderSupplier";
import orderSupplierApi from "./orderSupplier.api";
import * as orderSupplierAuth from "./orderSupplier.auth";
import * as orderSupplierHook from "./orderSupplier.hook";
import * as orderSupplierService from "./orderSupplier.service";
import * as orderSupplierModels from "./orderSupplier.modal";
import * as constants from "./constants"
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import SaleScreen from "./components/createOrderSupplierScreen/SaleScreen";
import { CreateOrderSupplierProvider } from "./storeContext/CreateOrderSupplierContext";
import components from "./components";
import { UpdateOrderSupplierProvider } from "./storeContext/UpdateOrderSupplierContext";
import UpdateOrderSupplier from "./screens/UpdateOrderSupplier"

const moduleExport = {
    page : {
        index : OrderSupplierScreen,
        create : SaleScreen,
        update : UpdateOrderSupplier,
    },
    api : orderSupplierApi,
    auth : orderSupplierAuth,
    hook : orderSupplierHook,
    service : orderSupplierService,
    model : orderSupplierModels,
    redux : {reducer,saga},
    storeProvider : {
        CreateOrderSupplier : CreateOrderSupplierProvider,
        UpdateOrderSupplier : UpdateOrderSupplierProvider
    },
    components,
    constants,
};
export default moduleExport;