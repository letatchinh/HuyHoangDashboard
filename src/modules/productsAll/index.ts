import ProductsAllScreen from "./screens/ProductsAll";
import productsAllApi from "./productsAll.api";
import * as productsAllAuth from "./productsAll.auth";
import * as productsAllHook from "./productsAll.hook";
import * as productsAllService from "./productsAll.service";
import * as productsAllModels from "./productsAll.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : ProductsAllScreen,
    },
    api : productsAllApi,
    auth : productsAllAuth,
    hook : productsAllHook,
    service : productsAllService,
    model : productsAllModels,
    redux : {reducer,saga}
};
export default moduleExport;