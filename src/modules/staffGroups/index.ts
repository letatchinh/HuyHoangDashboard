import StaffGroupsScreen from "./screens/StaffGroups";
import staffGroupsApi from "./staffGroups.api";
import * as staffGroupsHook from "./staffGroups.hook";
import * as staffGroupsService from "./staffGroups.service";
import * as staffGroupsModels from "./staffGroups.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : StaffGroupsScreen,
    },
    api : staffGroupsApi,
    hook : staffGroupsHook,
    service : staffGroupsService,
    model : staffGroupsModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;