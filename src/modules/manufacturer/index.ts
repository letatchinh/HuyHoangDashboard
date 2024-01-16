import Manufacturer from "./screens/Manufacturer";
import manufacturerApi from "./manufacturer.api";
import * as manufacturerHook from "./manufacturer.hook";
import manufacturerAuth from "./manufacturer.auth";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import ManufacturerForm from "./screens/ManufacturerForm";

const moduleExport = {
    page : {
        index : Manufacturer,
        form : ManufacturerForm
    },
    api : manufacturerApi,
    hook : manufacturerHook,
    auth: manufacturerAuth,
    redux : {reducer,saga}
};
export default moduleExport;