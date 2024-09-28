import AuthScreen from "./screens/Login";
import authApi from "./auth.api";
import * as authHook from "./auth.hook";
import * as authService from "./auth.service";
import * as authModels from "./auth.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";
import Login from "./screens/Login";

const moduleExport = {
    page : {
        login : Login,
    },
    api : authApi,
    hook : authHook,
    service : authService,
    model : authModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;