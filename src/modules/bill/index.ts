import BillScreen from "./screens/Bill";
import CreateBillScreen from "./screens/CreateBill";
import billApi from "./bill.api";
import components from "./components";
import * as billAuth from "./bill.auth";
import * as billHook from "./bill.hook";
import * as billService from "./bill.service";
import * as billModels from "./bill.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : BillScreen,
        create : CreateBillScreen
    },
    api : billApi,
    auth : billAuth,
    hook : billHook,
    service : billService,
    model : billModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;