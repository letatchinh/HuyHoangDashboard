import ReportGroupScreen from "./screens/ReportGroup";
import reportGroupApi from "./reportGroup.api";
import * as reportGroupHook from "./reportGroup.hook";
import * as reportGroupService from "./reportGroup.service";
import * as reportGroupModels from "./reportGroup.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportGroupScreen,
    },
    api : reportGroupApi,
    hook : reportGroupHook,
    service : reportGroupService,
    model : reportGroupModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;