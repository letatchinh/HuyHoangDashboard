import ConfigurationCronTimeScreen from "./screens/ConfigurationCronTime";
import configurationCronTimeApi from "./configurationCronTime.api";
import * as configurationCronTimeAuth from "./configurationCronTime.auth";
import * as configurationCronTimeHook from "./configurationCronTime.hook";
import * as configurationCronTimeService from "./configurationCronTime.service";
import * as configurationCronTimeModels from "./configurationCronTime.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : ConfigurationCronTimeScreen,
    },
    api : configurationCronTimeApi,
    auth : configurationCronTimeAuth,
    hook : configurationCronTimeHook,
    service : configurationCronTimeService,
    model : configurationCronTimeModels,
    redux : {reducer,saga}
};
export default moduleExport;