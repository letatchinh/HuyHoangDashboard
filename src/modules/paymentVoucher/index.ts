import paymentVoucherApi from "./paymentVoucher.api";
import * as paymentVoucherAuth from "./paymentVoucher.auth";
import * as paymentVoucherHook from "./paymentVoucher.hook";
import * as paymentVoucherService from "./paymentVoucher.service";
import * as paymentVoucherModels from "./paymentVoucher.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    api : paymentVoucherApi,
    auth : paymentVoucherAuth,
    hook : paymentVoucherHook,
    service : paymentVoucherService,
    model : paymentVoucherModels,
    redux: { reducer, saga },
    components : components
};
export default moduleExport;