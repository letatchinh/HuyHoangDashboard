import WorkBoardScreen from "./screens/WorkBoard";
import workBoardApi from "./workBoard.api";
import * as workBoardAuth from "./workBoard.auth";
import * as workBoardHook from "./workBoard.hook";
import * as workBoardService from "./workBoard.service";
import * as workBoardModels from "./workBoard.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : WorkBoardScreen,
    },
    api : workBoardApi,
    auth : workBoardAuth,
    hook : workBoardHook,
    service : workBoardService,
    model : workBoardModels,
    redux : {reducer,saga}
};
export default moduleExport;