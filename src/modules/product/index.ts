import ProductScreen from "./screens/Product";
import productApi from "./product.api";
import * as constants from "./constants";
import * as productAuth from "./product.auth";
import * as productHook from "./product.hook";
import * as productService from "./product.service";
import * as productModels from "./product.modal";
import  productComponents from "./components";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : ProductScreen,
    },
    api : productApi,
    auth : productAuth,
    hook : productHook,
    service : productService,
    model : productModels,
    redux : {reducer,saga},
    components : productComponents,
    constants,
};
export default moduleExport;