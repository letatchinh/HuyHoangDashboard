import SaleChannelScreen from "./screens/SaleChannel";
import saleChannelApi from "./saleChannel.api";
import * as saleChannelAuth from "./saleChannel.auth";
import * as saleChannelHook from "./saleChannel.hook";
import * as saleChannelService from "./saleChannel.service";
import * as saleChannelModels from "./saleChannel.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : SaleChannelScreen,
    },
    api : saleChannelApi,
    auth : saleChannelAuth,
    hook : saleChannelHook,
    service : saleChannelService,
    model : saleChannelModels,
    redux : {reducer,saga}
};
export default moduleExport;