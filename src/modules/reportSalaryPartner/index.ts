import ReportSalaryPartnerScreen from "./screens/ReportSalaryPartner";
import reportSalaryPartnerApi from "./reportSalaryPartner.api";
import * as reportSalaryPartnerAuth from "./reportSalaryPartner.auth";
import * as reportSalaryPartnerHook from "./reportSalaryPartner.hook";
import * as reportSalaryPartnerService from "./reportSalaryPartner.service";
import * as reportSalaryPartnerModels from "./reportSalaryPartner.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportSalaryPartnerScreen,
    },
    api : reportSalaryPartnerApi,
    auth : reportSalaryPartnerAuth,
    hook : reportSalaryPartnerHook,
    service : reportSalaryPartnerService,
    model : reportSalaryPartnerModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;