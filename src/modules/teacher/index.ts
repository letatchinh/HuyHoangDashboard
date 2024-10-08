import TeacherScreen from "./screens/Teacher";
import teacherApi from "./teacher.api";
import * as teacherHook from "./teacher.hook";
import * as teacherService from "./teacher.service";
import * as teacherModels from "./teacher.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : TeacherScreen,
    },
    api : teacherApi,
    hook : teacherHook,
    service : teacherService,
    model : teacherModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;