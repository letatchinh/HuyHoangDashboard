import { persistReducer } from 'redux-persist';

import { combineReducers } from "redux";
import localStorage from 'redux-persist/es/storage';
import authModule from '~/modules/auth';
import supplierModule from '~/modules/supplier';
import branchModule from '~/modules/branch';
import geoModule from '~/modules/geo';
import configDiscount from '~/modules/configDiscount';
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
    configDiscount: configDiscount.redux.reducer,
});
export default rootReducer