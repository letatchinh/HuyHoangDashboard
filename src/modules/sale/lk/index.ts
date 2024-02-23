import LkScreen from "./screens/Lk";
import lkApi from "./lk.api";
import * as lkAuth from "./lk.auth";
import * as lkHook from "./lk.hook";
import * as lkService from "./lk.service";
import * as lkModels from "./lk.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : LkScreen,
    },
    api : lkApi,
    auth : lkAuth,
    hook : lkHook,
    service : lkService,
    model : lkModels,
    redux : {reducer,saga}
};
export default moduleExport;