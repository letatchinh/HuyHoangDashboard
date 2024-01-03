import ProductConfig from "./screens/ProductConfig";
import productApi from "./productConfig.api";
import * as productConfigHook from "./productConfig.hook";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport ={
    page:{
        index : ProductConfig,
    },
    api : productApi,
    hook : productConfigHook,
    redux:{reducer,saga}

}

export default moduleExport
