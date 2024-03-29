import TypePharmacyScreen from "./screens/TypePharmacy";
import typePharmacyApi from "./typePharmacy.api";
import * as typePharmacyAuth from "./typePharmacy.auth";
import * as typePharmacyHook from "./typePharmacy.hook";
import * as typePharmacyService from "./typePharmacy.service";
import * as typePharmacyModels from "./typePharmacy.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : TypePharmacyScreen,
    },
    api : typePharmacyApi,
    auth : typePharmacyAuth,
    hook : typePharmacyHook,
    service : typePharmacyService,
    model : typePharmacyModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;