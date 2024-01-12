import ConfigDiscountScreen from "./screens/ConfigDiscount";
import configDiscountApi from "./configDiscount.api";
import * as configDiscountAuth from "./configDiscount.auth";
import * as configDiscountHook from "./configDiscount.hook";
import * as configDiscountService from "./configDiscount.service";
import * as configDiscountModels from "./configDiscount.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : ConfigDiscountScreen,
    },
    api : configDiscountApi,
    auth : configDiscountAuth,
    hook : configDiscountHook,
    service : configDiscountService,
    model : configDiscountModels,
    redux : {reducer,saga}
};
export default moduleExport;