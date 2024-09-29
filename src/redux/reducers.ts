
import { persistReducer } from 'redux-persist';

import { combineReducers } from "redux";
import localStorage from 'redux-persist/es/storage';
import course from '~/modules/course';
import schedule from '~/modules/schedule';
import scheduleItem from '~/modules/scheduleItem';
import auth from '~/modules/auth';
import staff from '~/modules/staff';
import policy from '~/modules/policy';
import staffGroups from '~/modules/staffGroups';

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
  auth: persistReducer(authPersistConfig, auth.redux.reducer),
  course: course.redux.reducer,
  schedule: schedule.redux.reducer,
  scheduleItem: scheduleItem.redux.reducer,
  staff: staff.redux.reducer,
  policy: policy.redux.reducer,
  staffGroups: staffGroups.redux.reducer,
});
export default rootReducer