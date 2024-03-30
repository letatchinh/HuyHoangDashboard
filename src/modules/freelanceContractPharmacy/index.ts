import FreelanceContractPharmacyScreen from "./screens/FreelanceContractPharmacy";
import freelanceContractPharmacyApi from "./freelanceContractPharmacy.api";
import * as freelanceContractPharmacyAuth from "./freelanceContractPharmacy.auth";
import * as freelanceContractPharmacyHook from "./freelanceContractPharmacy.hook";
import * as freelanceContractPharmacyService from "./freelanceContractPharmacy.service";
import * as freelanceContractPharmacyModels from "./freelanceContractPharmacy.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : FreelanceContractPharmacyScreen,
    },
    api : freelanceContractPharmacyApi,
    auth : freelanceContractPharmacyAuth,
    hook : freelanceContractPharmacyHook,
    service : freelanceContractPharmacyService,
    model : freelanceContractPharmacyModels,
    redux : {reducer,saga}
};
export default moduleExport;