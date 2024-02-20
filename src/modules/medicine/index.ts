import MedicineScreen from "./screens/Medicine";
import medicineApi from "./medicine.api";
import * as medicineAuth from "./medicine.auth";
import * as medicineHook from "./medicine.hook";
import * as medicineService from "./medicine.service";
import * as medicineModels from "./medicine.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : MedicineScreen,
    },
    api : medicineApi,
    auth : medicineAuth,
    hook : medicineHook,
    service : medicineService,
    model : medicineModels,
    redux : {reducer,saga}
};
export default moduleExport;