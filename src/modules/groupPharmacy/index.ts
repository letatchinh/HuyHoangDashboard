import GroupPharmacyScreen from "./screens/GroupPharmacy";
import groupPharmacyApi from "./groupPharmacy.api";
import * as groupPharmacyAuth from "./groupPharmacy.auth";
import * as groupPharmacyHook from "./groupPharmacy.hook";
import * as groupPharmacyService from "./groupPharmacy.service";
import * as groupPharmacyModels from "./groupPharmacy.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : GroupPharmacyScreen,
    },
    api : groupPharmacyApi,
    auth : groupPharmacyAuth,
    hook : groupPharmacyHook,
    service : groupPharmacyService,
    model : groupPharmacyModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;