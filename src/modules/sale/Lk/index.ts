import LkScreen from "./screens/Lk";
import LkApi from "./Lk.api";
import * as LkAuth from "./Lk.auth";
import * as LkHook from "./Lk.hook";
import * as LkService from "./Lk.service";
import * as LkModels from "./Lk.modal";
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