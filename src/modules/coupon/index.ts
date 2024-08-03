import CouponScreen from "./screens/Coupon";
import couponApi from "./coupon.api";
import * as couponHook from "./coupon.hook";
import * as couponService from "./coupon.service";
import * as couponModels from "./coupon.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components/index";

const moduleExport = {
    page : {
        index : CouponScreen,
    },
    api : couponApi,
    hook : couponHook,
    service : couponService,
    model : couponModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;