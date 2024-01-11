import { all } from 'redux-saga/effects';
import authModule from '~/modules/auth';
import supplierModule from '~/modules/supplier';
import branchModule from '~/modules/branch';
import geoModule from '~/modules/geo';
import employeeModule from '~/modules/employee';
import userModule from '~/modules/user';
import userGroupModule from '~/modules/userGroup';
import policyModule from '~/modules/policy';
import configDiscountModule from '~/modules/configDiscount';
import pharmacyModule from '~/modules/pharmacy';
export default function* rootSaga() {
  yield all([
    authModule.redux.saga(),
    supplierModule.redux.saga(),
    branchModule.redux.saga(),
    geoModule.redux.saga(),
    employeeModule.redux.saga(),
    userModule.redux.saga(),
    userGroupModule.redux.saga(),
    policyModule.redux.saga(),
    configDiscountModule.redux.saga(),
    pharmacyModule.redux.saga(),
  ]);
};
