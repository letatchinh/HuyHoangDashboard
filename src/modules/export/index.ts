import exportApi from "./export.api";
import * as exportAuth from "./export.auth";
import * as exportHook from "./export.hook";
import * as exportService from "./export.service";
import * as exportModels from "./export.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    // page : {
    //     index : ExportScreen,
    // },
    api : exportApi,
    auth : exportAuth,
    hook : exportHook,
    service : exportService,
    model : exportModels,
    redux : {reducer,saga}
};
export default moduleExport;