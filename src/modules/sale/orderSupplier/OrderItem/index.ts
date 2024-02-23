import billItemApi from "./orderItem.api";
import * as billItemAuth from "./orderItem.auth";
import * as billItemHook from "./orderItem.hook";
import * as billItemService from "./orderItem.service";
import * as billItemModels from "./orderItem.modal";
import * as constants from "./constants";
import components from './components';
const moduleExport = {
    api : billItemApi,
    auth : billItemAuth,
    hook : billItemHook,
    service : billItemService,
    model : billItemModels,
    constants,
    components,
};
export default moduleExport;