
import { persistReducer } from 'redux-persist';

import { combineReducers } from "@reduxjs/toolkit";
import localStorage from 'redux-persist/es/storage';
import * as course from '~/modules/course';
import * as courseGroup from '~/modules/courseGroup';
import * as policy from '~/modules/policy';
import * as schedule from '~/modules/schedule';
import * as scheduleItem from '~/modules/scheduleItem';
import * as staff from '~/modules/staff';
import * as auth from '~/modules/auth';
import * as staffGroups from '~/modules/staffGroups';
import * as teacher from '~/modules/teacher';
import * as test from '~/modules/test';

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
  auth: persistReducer(authPersistConfig, auth.reducer),
  course: course.reducer,
  schedule: schedule.reducer,
  scheduleItem: scheduleItem.reducer,
  staff: staff.reducer,
  policy: policy.reducer,
  staffGroups: staffGroups.reducer,
  courseGroup: courseGroup.reducer,
  teacher: teacher.reducer,
  test: test.reducer,
});
export default rootReducer