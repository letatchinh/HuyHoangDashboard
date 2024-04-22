// import NotificationScreen from "./screens/Notification";
import notificationApi from "./notification.api";
import * as notificationAuth from "./notification.auth";
import * as notificationHook from "./notification.hook";
import * as notificationService from "./notification.service";
import * as notificationModels from "./notification.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        // index : NotificationScreen,
    },
    api : notificationApi,
    auth : notificationAuth,
    hook : notificationHook,
    service : notificationService,
    model : notificationModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;