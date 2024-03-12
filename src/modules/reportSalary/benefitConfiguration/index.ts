import BenefitConfigurationScreen from "./screens/BenefitConfiguration";
import benefitConfigurationApi from "./benefitConfiguration.api";
import * as benefitConfigurationAuth from "./benefitConfiguration.auth";
import * as benefitConfigurationHook from "./benefitConfiguration.hook";
import * as benefitConfigurationService from "./benefitConfiguration.service";
import * as benefitConfigurationModels from "./benefitConfiguration.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components/index";

const moduleExport = {
    page : {
        index : BenefitConfigurationScreen,
    },
    api : benefitConfigurationApi,
    auth : benefitConfigurationAuth,
    hook : benefitConfigurationHook,
    service : benefitConfigurationService,
    model : benefitConfigurationModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;