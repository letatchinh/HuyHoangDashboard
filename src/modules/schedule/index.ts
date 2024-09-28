import ScheduleScreen from "./screens/Schedule";
import scheduleApi from "./schedule.api";
import * as scheduleHook from "./schedule.hook";
import * as scheduleService from "./schedule.service";
import * as scheduleModels from "./schedule.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ScheduleScreen,
    },
    api : scheduleApi,
    hook : scheduleHook,
    service : scheduleService,
    model : scheduleModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;