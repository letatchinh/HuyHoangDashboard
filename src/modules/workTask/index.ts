import WorkTaskScreen from "./screens/WorkTask";
import workTaskApi from "./workTask.api";
import * as workTaskAuth from "./workTask.auth";
import * as workTaskHook from "./workTask.hook";
import * as workTaskService from "./workTask.service";
import * as workTaskModels from "./workTask.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : WorkTaskScreen,
    },
    api : workTaskApi,
    auth : workTaskAuth,
    hook : workTaskHook,
    service : workTaskService,
    model : workTaskModels,
    redux : {reducer,saga}
};
export default moduleExport;