import ReportSubFeeScreen from "./screens/ReportSubFee";
import reportSubFeeApi from "./reportSubFee.api";
import * as reportSubFeeHook from "./reportSubFee.hook";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportSubFeeScreen,
    },
    api : reportSubFeeApi,
    hook : reportSubFeeHook,
    redux : {reducer,saga},
    components,
};
export default moduleExport;