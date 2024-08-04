import WarehouseScreen from "./screens/Warehouse";
import warehouseApi from "./warehouse.api";
import * as warehouseHook from "./warehouse.hook";
import * as warehouseService from "./warehouse.service";
import * as warehouseModels from "./warehouse.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";
import Inventory from "./components/Inventory";

const moduleExport = {
    page : {
        index: WarehouseScreen,
        inventory: Inventory
    },
    api : warehouseApi,
    hook : warehouseHook,
    service : warehouseService,
    model : warehouseModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;