import RankingScreen from "./screens/Ranking";
import rankingApi from "./ranking.api";
import * as rankingAuth from "./ranking.auth";
import * as rankingHook from "./ranking.hook";
import * as rankingService from "./ranking.service";
import * as rankingModels from "./ranking.modal";
import reducer from "./redux/reducer";
import saga from "./redux/saga";

const moduleExport = {
    page : {
        index : RankingScreen,
    },
    api : rankingApi,
    auth : rankingAuth,
    hook : rankingHook,
    service : rankingService,
    model : rankingModels,
    redux : {reducer,saga}
};
export default moduleExport;