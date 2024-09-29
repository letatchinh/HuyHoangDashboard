import CourseGroupScreen from "./screens/CourseGroup";
import courseGroupApi from "./courseGroup.api";
import * as courseGroupHook from "./courseGroup.hook";
import * as courseGroupService from "./courseGroup.service";
import * as courseGroupModels from "./courseGroup.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : CourseGroupScreen,
    },
    api : courseGroupApi,
    hook : courseGroupHook,
    service : courseGroupService,
    model : courseGroupModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;