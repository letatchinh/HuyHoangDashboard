import CourseScreen from "./screens/Course";
import courseApi from "./course.api";
import * as courseHook from "./course.hook";
import * as courseService from "./course.service";
import * as courseModels from "./course.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : CourseScreen,
    },
    api : courseApi,
    hook : courseHook,
    service : courseService,
    model : courseModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;