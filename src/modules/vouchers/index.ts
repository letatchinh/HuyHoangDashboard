import VouchersScreen from "./screens/Vouchers";
import vouchersApi from "./vouchers.api";
import components from "./components";
import * as vouchersAuth from "./vouchers.auth";
import * as vouchersHook from "./vouchers.hook";
import * as vouchersService from "./vouchers.service";
import * as vouchersModels from "./vouchers.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : VouchersScreen,
    },
    api : vouchersApi,
    auth : vouchersAuth,
    hook : vouchersHook,
    service : vouchersService,
    model : vouchersModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;