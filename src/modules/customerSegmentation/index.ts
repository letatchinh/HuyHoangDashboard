import CustomerSegmentationScreen from "./screens/CustomerSegmentation";
import customerSegmentationApi from "./customerSegmentation.api";
import * as customerSegmentationHook from "./customerSegmentation.hook";
import * as customerSegmentationService from "./customerSegmentation.service";
import * as customerSegmentationModels from "./customerSegmentation.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : CustomerSegmentationScreen,
    },
    api : customerSegmentationApi,
    hook : customerSegmentationHook,
    service : customerSegmentationService,
    model : customerSegmentationModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;