import QuotationScreen from "./screens/Quotation";
import quotationApi from "./quotation.api";
import * as quotationAuth from "./quotation.auth";
import * as quotationHook from "./quotation.hook";
import * as quotationService from "./quotation.service";
import * as quotationModels from "./quotation.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : QuotationScreen,
    },
    api : quotationApi,
    auth : quotationAuth,
    hook : quotationHook,
    service : quotationService,
    model : quotationModels,
    redux : {reducer,saga}
};
export default moduleExport;