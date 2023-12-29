import geoApi from "./geo.api";
import * as geoHook from "./geo.hook";
import * as geoService from "./geo.service";
import * as geoModels from "./geo.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    api : geoApi,
    hook : geoHook,
    service : geoService,
    model : geoModels,
    redux : {reducer,saga},
};
export default moduleExport;