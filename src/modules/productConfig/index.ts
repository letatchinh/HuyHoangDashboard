import ProductConfig from "./screens/ProductConfig";
import productApi from "./productConfig.api";
import * as productConfigHook from "./productConfig.hook";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import productConfigAuth from "./productConfig.auth";
import ProductConfigForm from "./screens/ProductConfigForm";
const moduleExport ={
    page:{
        index : ProductConfig,
        form : ProductConfigForm
    },
    api : productApi,
    hook : productConfigHook,
    auth:productConfigAuth,
    redux:{reducer,saga}

}

export default moduleExport
