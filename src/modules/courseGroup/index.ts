import courseGroupApi from "./courseGroup.api";
import * as courseGroupHook from "./courseGroup.hook";
import * as courseGroupService from "./courseGroup.service";
import * as courseGroupModels from "./courseGroup.modal";

export * from './redux'
export * from './screens'
export * from './components'

const moduleExport = {
    api : courseGroupApi,
    hook : courseGroupHook,
    service : courseGroupService,
    model : courseGroupModels,
};
export default moduleExport;