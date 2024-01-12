
import { persistReducer } from 'redux-persist';

import { combineReducers } from "redux";
import localStorage from 'redux-persist/es/storage';
import authModule from '~/modules/auth';
import supplierModule from '~/modules/supplier';
import branchModule from '~/modules/branch';
import productGroupModule from '~/modules/productGroup';
import geoModule from '~/modules/geo';
import statusModule from '~/modules/statusConfig';
import employeeModule from '~/modules/employee';
import userModule from '~/modules/user';
import userGroupModule from '~/modules/userGroup';
import policy from '~/modules/policy';
import manufacturerModule from '~/modules/manufacturer';
import productUnitModule from '~/modules/productUnit';
import rankingModule from '~/modules/ranking';
import medicineModule from '~/modules/medicine';
import workBoardModule from '~/modules/workBoard';
import workSprintModule from '~/modules/workSprint';
import workListModule from '~/modules/workList';
const authPersistConfig = {
    key: 'auth',
    storage: localStorage,
    blacklist: [
        'loginFailed',
        'isLoading',
        'isGetProfileLoading',
        'getProfileFailed',
        'updateProfileSuccess',
        'updateProfileFailed',
        'isUpdateProfileLoading',
      ]
  };
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authModule.redux.reducer),
    supplier: supplierModule.redux.reducer,
    branch: branchModule.redux.reducer,
    geo: geoModule.redux.reducer,
    statusConfig: statusModule.redux.reducer,
    employee: employeeModule.redux.reducer,
    user: userModule.redux.reducer,
    userGroup: userGroupModule.redux.reducer,
    policy: policy.redux.reducer,
    productGroup:productGroupModule.redux.reducer,
    manufacturer:manufacturerModule.redux.reducer,
    productUnit:productUnitModule.redux.reducer,
    ranking:rankingModule.redux.reducer,
    medicine:medicineModule.redux.reducer,
    workBoard:workBoardModule.redux.reducer,
    workSprint:workSprintModule.redux.reducer,
    workList:workListModule.redux.reducer,

});
export default rootReducer