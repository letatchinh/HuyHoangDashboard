import * as constants from "./constants";
import * as Service from "./cumulativeDiscount.service";
import * as Models from "./cumulativeDiscount.modal";
import Components from "./components";

const moduleExport = {
    service : Service,
    model : Models,
    components : Components,
    constants,
};
export default moduleExport;