import DiscountScreen from "./screens/Discount";
import discountApi from "./discount.api";
import * as discountHook from "./discount.hook";
import * as discountService from "./discount.service";
import * as discountModels from "./discount.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : DiscountScreen,
    },
    api : discountApi,
    hook : discountHook,
    service : discountService,
    model : discountModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;