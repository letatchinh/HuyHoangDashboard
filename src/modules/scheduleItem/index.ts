import ScheduleItemScreen from "./screens/ScheduleItem";
import scheduleItemApi from "./scheduleItem.api";
import * as scheduleItemHook from "./scheduleItem.hook";
import * as scheduleItemService from "./scheduleItem.service";
import * as scheduleItemModels from "./scheduleItem.modal";

export * from "./redux";
export * from "./components";

const moduleExport = {
    page : {
        index : ScheduleItemScreen,
    },
    api : scheduleItemApi,
    hook : scheduleItemHook,
    service : scheduleItemService,
    model : scheduleItemModels,
};
export default moduleExport;