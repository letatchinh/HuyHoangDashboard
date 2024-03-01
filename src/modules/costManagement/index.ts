import CostManagementScreen from "./screens/CostManagement";
import costManagementApi from "./costManagement.api";
import * as costManagementAuth from "./costManagement.auth";
import * as costManagementHook from "./costManagement.hook";
import * as costManagementService from "./costManagement.service";
import * as costManagementModels from "./costManagement.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : CostManagementScreen,
    },
    api : costManagementApi,
    auth : costManagementAuth,
    hook : costManagementHook,
    service : costManagementService,
    model : costManagementModels,
    redux : {reducer,saga}
};
export default moduleExport;