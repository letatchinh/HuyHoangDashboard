import BillScreen from "./screens/Bill";
import CreateBill from "./screens/CreateBill";
import CreateBillScreen from "./screens/CreateBill";
import billApi from "./bill.api";
import components from "./components/index";
import * as billAuth from "./bill.auth";
import * as billHook from "./bill.hook";
import * as billService from "./bill.service";
import * as billModels from "./bill.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import UpdateBill from "./screens/UpdateBill";
import  {UpdateBillProvider}  from "./storeContext/UpdateBillContext";
import { CreateBillProvider } from "./storeContext/CreateBillContext";
const moduleExport = {
    page : {
        index : BillScreen,
        create : CreateBill,
        update : UpdateBill
    },
    api : billApi,
    auth : billAuth,
    hook : billHook,
    service : billService,
    model : billModels,
    redux : {reducer,saga},
    components,
    storeProvider : {
        UpdateBillProvider,
        CreateBillProvider
    }
};
export default moduleExport;