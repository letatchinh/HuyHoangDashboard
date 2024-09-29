import { all } from 'redux-saga/effects';
import course from '~/modules/course';
import schedule from '~/modules/schedule';
import scheduleItem from '~/modules/scheduleItem';
import courseGroup from '~/modules/courseGroup';
import auth from '~/modules/auth';
import staff from '~/modules/staff';
import policy from '~/modules/policy';
import staffGroups from '~/modules/staffGroups';

export default function* rootSaga() {
  yield all([
    course.redux.saga(),
    schedule.redux.saga(),
    scheduleItem.redux.saga(),
    courseGroup.redux.saga(),
    auth.redux.saga(),
    staff.redux.saga(),
    policy.redux.saga(),
    staffGroups.redux.saga(),
    courseGroup.redux.saga(),
  ]);
};
