import WorkListScreen from "./screens/WorkList";
import workListApi from "./workList.api";
import * as workListAuth from "./workList.auth";
import * as workListHook from "./workList.hook";
import * as workListService from "./workList.service";
import * as workListModels from "./workList.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : WorkListScreen,
    },
    api : workListApi,
    auth : workListAuth,
    hook : workListHook,
    service : workListService,
    model : workListModels,
    redux : {reducer,saga}
};
export default moduleExport;