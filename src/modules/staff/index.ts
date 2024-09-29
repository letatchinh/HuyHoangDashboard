import StaffScreen from "./screens/Staff";
import staffApi from "./staff.api";
import * as staffHook from "./staff.hook";
import * as staffService from "./staff.service";
import * as staffModels from "./staff.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : StaffScreen,
    },
    api : staffApi,
    hook : staffHook,
    service : staffService,
    model : staffModels,
    redux : {reducer,saga},
};
export default moduleExport;