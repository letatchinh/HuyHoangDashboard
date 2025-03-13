import { all } from 'redux-saga/effects';
import * as course from '~/modules/course';
import * as courseGroup from '~/modules/courseGroup';
import * as policy from '~/modules/policy';
import * as schedule from '~/modules/schedule';
import * as scheduleItem from '~/modules/scheduleItem';
import * as auth from '~/modules/auth';
import * as staff from '~/modules/staff';
import * as staffGroups from '~/modules/staffGroups';
import * as teacher from '~/modules/teacher';

export default function* rootSaga() {
  yield all([
    course.saga(),
    schedule.saga(),
    scheduleItem.saga(),
    staff.saga(),
    policy.saga(),
    courseGroup.saga(),
    auth.saga(),
    staffGroups.saga(),
    teacher.saga(),
  ]);
};
