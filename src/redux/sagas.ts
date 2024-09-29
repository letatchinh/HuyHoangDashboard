import { all } from 'redux-saga/effects';
import course from '~/modules/course';
import schedule from '~/modules/schedule';
import scheduleItem from '~/modules/scheduleItem';
import courseGroup from '~/modules/courseGroup';

export default function* rootSaga() {
  yield all([
    course.redux.saga(),
    schedule.redux.saga(),
    scheduleItem.redux.saga(),
    courseGroup.redux.saga(),
  ]);
};
