import AreaConfigurationScreen from "./screens/AreaConfiguration";
import areaConfigurationApi from "./areaConfiguration.api";
import * as areaConfigurationAuth from "./areaConfiguration.auth";
import * as areaConfigurationHook from "./areaConfiguration.hook";
import * as areaConfigurationService from "./areaConfiguration.service";
import * as areaConfigurationModels from "./areaConfiguration.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : AreaConfigurationScreen,
    },
    api : areaConfigurationApi,
    auth : areaConfigurationAuth,
    hook : areaConfigurationHook,
    service : areaConfigurationService,
    model : areaConfigurationModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;