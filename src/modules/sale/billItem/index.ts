import billItemApi from "./billItem.api";
import * as billItemAuth from "./billItem.auth";
import * as billItemHook from "./billItem.hook";
import * as billItemService from "./billItem.service";
import * as billItemModels from "./billItem.modal";
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