import PaymentVoucherScreen from "./screens/PaymentVoucher";
import paymentVoucherApi from "./paymentVoucher.api";
import * as paymentVoucherAuth from "./paymentVoucher.auth";
import * as paymentVoucherHook from "./paymentVoucher.hook";
import * as paymentVoucherService from "./paymentVoucher.service";
import * as paymentVoucherModels from "./paymentVoucher.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : PaymentVoucherScreen,
    },
    api : paymentVoucherApi,
    auth : paymentVoucherAuth,
    hook : paymentVoucherHook,
    service : paymentVoucherService,
    model : paymentVoucherModels,
    redux: { reducer, saga },
};
export default moduleExport;