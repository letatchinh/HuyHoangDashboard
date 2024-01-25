import BotNotificationScreen from './screens/BotNotification';
import botNotificationApi from "./botNotification.api";
import * as botNotificationAuth from "./botNotification.auth";
import * as botNotificationHook from "./botNotification.hook";
import * as botNotificationService from "./botNotification.service";
import * as botNotificationModels from "./botNotification.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : BotNotificationScreen,
    },
    api : botNotificationApi,
    auth : botNotificationAuth,
    hook : botNotificationHook,
    service : botNotificationService,
    model : botNotificationModels,
    redux : {reducer,saga}
};
export default moduleExport;