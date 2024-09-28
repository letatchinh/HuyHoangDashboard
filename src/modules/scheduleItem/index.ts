import ScheduleItemScreen from "./screens/ScheduleItem";
import scheduleItemApi from "./scheduleItem.api";
import * as scheduleItemHook from "./scheduleItem.hook";
import * as scheduleItemService from "./scheduleItem.service";
import * as scheduleItemModels from "./scheduleItem.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ScheduleItemScreen,
    },
    api : scheduleItemApi,
    hook : scheduleItemHook,
    service : scheduleItemService,
    model : scheduleItemModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;