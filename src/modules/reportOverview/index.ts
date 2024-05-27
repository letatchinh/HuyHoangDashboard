import ReportOverviewScreen from "./screens/ReportOverview";
import reportOverviewApi from "./reportOverview.api";
import * as reportOverviewHook from "./reportOverview.hook";
import * as reportOverviewService from "./reportOverview.service";
import * as reportOverviewModels from "./reportOverview.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import components from "./components";

const moduleExport = {
    page : {
        index : ReportOverviewScreen,
    },
    api : reportOverviewApi,
    hook : reportOverviewHook,
    service : reportOverviewService,
    model : reportOverviewModels,
    redux : {reducer,saga},
    components,
};
export default moduleExport;