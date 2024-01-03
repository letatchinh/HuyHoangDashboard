import Manufacturer from "./screens/Manufacturer";
import manufacturerApi from "./manufacturer.api";
// import * as manufacturerHook from "./manufacturer.hook";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : Manufacturer,
    },
    api : manufacturerApi,
    // hook : manufacturerHook,
    redux : {reducer,saga}
};
export default moduleExport;