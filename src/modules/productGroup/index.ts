import ProductGroupForm from "./screens/ProductGroupForm";
import productApi from "./productGroup.api";
import * as productGroupFormHook from "./productGroup.hook";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import productGroupFormAuth from "./productGroup.auth";
import ProductConfig from "./screens/ProductGroup";
const moduleExport ={
    page:{
        index : ProductConfig,
        form : ProductGroupForm
    },
    api : productApi,
    hook : productGroupFormHook,
    auth:productGroupFormAuth,
    redux:{reducer,saga}

}

export default moduleExport
