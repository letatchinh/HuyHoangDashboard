import ProductUnitScreen from "./screens/ProductUnit";
import productUnitApi from "./productUnit.api";
import * as productUnitAuth from "./productUnit.auth";
import * as productUnitHook from "./productUnit.hook";
import * as productUnitService from "./productUnit.service";
import * as productUnitModels from "./productUnit.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : ProductUnitScreen,
    },
    api : productUnitApi,
    auth : productUnitAuth,
    hook : productUnitHook,
    service : productUnitService,
    model : productUnitModels,
    redux : {reducer,saga}
};
export default moduleExport;