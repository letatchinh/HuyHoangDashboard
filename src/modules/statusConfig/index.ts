import StatusConfigScreen from "./screens/StatusConfig";
import statusConfigApi from "./statusConfig.api";
import * as statusConfigAuth from "./statusConfig.auth";
import * as statusConfigHook from "./statusConfig.hook";
import * as statusConfigService from "./statusConfig.service";
import * as statusConfigModels from "./statusConfig.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : StatusConfigScreen,
    },
    api : statusConfigApi,
    auth : statusConfigAuth,
    hook : statusConfigHook,
    service : statusConfigService,
    model : statusConfigModels,
    redux : {reducer,saga}
};
export default moduleExport;