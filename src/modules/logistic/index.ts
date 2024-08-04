import LogisticScreen from "./screens/Logistic";
import logisticApi from "./logistic.api";
import * as logisticHook from "./logistic.hook";
import * as logisticService from "./logistic.service";
import * as logisticModels from "./logistic.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : LogisticScreen,
    },
    api : logisticApi,
    hook : logisticHook,
    service : logisticService,
    model : logisticModels,
    redux : {reducer,saga},
};
export default moduleExport;