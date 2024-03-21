import authApi from "./auth.api";
import * as authHooks from "./auth.hook";
import * as authService from "./auth.service";
import * as authModels from "./auth.modal";
import Login from "./screens/Login";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
const ModuleAuth = {
    page : {
        login: Login,
    },
    api : authApi,
    hook : authHooks,
    service : authService,
    model : authModels,
    redux : {reducer,saga},
}
export default ModuleAuth;