import HomepageScreen from "./screens/Homepage";
import homepageApi from "./homepage.api";
import * as homepageAuth from "./homepage.auth";
import * as homepageHook from "./homepage.hook";
import * as homepageService from "./homepage.service";
import * as homepageModels from "./homepage.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : HomepageScreen,
    },
    api : homepageApi,
    auth : homepageAuth,
    hook : homepageHook,
    service : homepageService,
    model : homepageModels,
    redux : {reducer,saga}
};
export default moduleExport;