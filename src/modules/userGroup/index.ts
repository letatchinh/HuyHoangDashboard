import UserGroupScreen from "./screens/UserGroup";
import userGroupApi from "./userGroup.api";
import * as userGroupAuth from "./userGroup.auth";
import * as userGroupHook from "./userGroup.hook";
import * as userGroupService from "./userGroup.service";
import * as userGroupModels from "./userGroup.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : UserGroupScreen,
    },
    api : userGroupApi,
    auth : userGroupAuth,
    hook : userGroupHook,
    service : userGroupService,
    model : userGroupModels,
    redux : {reducer,saga}
};
export default moduleExport;