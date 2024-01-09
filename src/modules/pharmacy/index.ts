import pharmacyApi from "./pharmacy.api"
import PharmacyScreen from "./screens/Pharmacy"
import reducer from "./redux/reducer"
import saga from "./redux/saga"
import * as pharmacyHook from "./pharmacy.hook"
import pharmacyService from "./pharmacy.service"
import pharmacyModals from "./pharmacy.modal"
import pharmacyAuth from "./pharmacy.auth"

const moduleExport = {
    api: pharmacyApi,
    page: {
       index: PharmacyScreen,
    },
    redux: {
        reducer,
        saga
    },
    hook : pharmacyHook,
    service : pharmacyService,
    modal : pharmacyModals,
    auth : pharmacyAuth,
}
export default moduleExport