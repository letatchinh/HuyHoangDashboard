
import { persistReducer } from 'redux-persist';

import { combineReducers } from "redux";
import localStorage from 'redux-persist/es/storage';
import course from '~/modules/course';
import schedule from '~/modules/schedule';
import scheduleItem from '~/modules/scheduleItem';
import courseGroup from '~/modules/courseGroup';

// const authPersistConfig = {
//     key: 'auth',
//     storage: localStorage,
//     blacklist: [
//         'loginFailed',
//         'isLoading',
//         'isGetProfileLoading',
//         'getProfileFailed',
//         'updateProfileSuccess',
//         'updateProfileFailed',
//         'isUpdateProfileLoading',
//       ]
//   };
const rootReducer = combineReducers({
  course: course.redux.reducer,
  schedule: schedule.redux.reducer,
  scheduleItem: scheduleItem.redux.reducer,
  courseGroup: courseGroup.redux.reducer,

});
export default rootReducer