import { all } from 'redux-saga/effects';
import course from '~/modules/course';
import schedule from '~/modules/schedule';
import scheduleItem from '~/modules/scheduleItem';

export default function* rootSaga() {
  yield all([
    course.redux.saga(),
    schedule.redux.saga(),
    scheduleItem.redux.saga(),
  ]);
};
