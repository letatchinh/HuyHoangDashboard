import UserScreen from "./screen/User";
import userApi from "./user.api";
// import userAuth from "./user.auth";
import * as userHook from "./user.hook";
// import userService from "./user.service";
// import userModels from "./user.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : UserScreen,
    },
    api : userApi,
    // auth : userAuth,
    hook : userHook,
    // service : userService,
    // model : userModels,
    redux : {reducer,saga}
};
export default moduleExport;