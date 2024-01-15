import ProductGroupForm from "./screens/ProductGroup";
import productApi from "./productGroup.api";
import * as productGroupFormHook from "./productGroup.hook";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import productGroupFormAuth from "./productGroup.auth";
const moduleExport ={
    page:{
        index : ProductGroupForm,
    },
    api : productApi,
    hook : productGroupFormHook,
    auth:productGroupFormAuth,
    redux:{reducer,saga}

}

export default moduleExport
