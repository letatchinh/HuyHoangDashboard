import ReportShipScreen from "./screens/ReportShip";
import reportShipApi from "./reportShip.api";
import * as reportShipHook from "./reportShip.hook";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportShipScreen,
    },
    api : reportShipApi,
    hook : reportShipHook,
    redux : {reducer,saga},
    components,
};
export default moduleExport;