import LkScreen from "./screens/lk";
import LkApi from "./lk.api";
import * as LkAuth from "./lk.auth";
import * as LkHook from "./lk.hook";
import * as LkService from "./lk.service";
import * as LkModels from "./lk.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : LkScreen,
    },
    api : LkApi,
    auth : LkAuth,
    hook : LkHook,
    service : LkService,
    model : LkModels,
    redux : {reducer,saga}
};
export default moduleExport;