import { all } from 'redux-saga/effects';
import authModule from '~/modules/auth';
import supplierModule from '~/modules/supplier';
import branchModule from '~/modules/branch';
import geoModule from '~/modules/geo';
import statusModule from '~/modules/statusConfig';
import employeeModule from '~/modules/employee';
import userModule from '~/modules/user';
import userGroupModule from '~/modules/userGroup';
import policyModule from '~/modules/policy';
import productGroupModule from '~/modules/productGroup';
import manuFacturerModule from '~/modules/manufacturer';
import productUnitModule from '~/modules/productUnit';
import rankModule from '~/modules/ranking';
import medicineModule from '~/modules/medicine';
import workBoardModule from '~/modules/workBoard';
import workSprintModule from '~/modules/workSprint';
import workListModule from '~/modules/workList';
export default function* rootSaga() {
  yield all([
    authModule.redux.saga(),
    supplierModule.redux.saga(),
    branchModule.redux.saga(),
    geoModule.redux.saga(),
    statusModule.redux.saga(),
    employeeModule.redux.saga(),
    userModule.redux.saga(),
    userGroupModule.redux.saga(),
    policyModule.redux.saga(),
    productGroupModule.redux.saga(),
    manuFacturerModule.redux.saga(),
    productUnitModule.redux.saga(),
    rankModule.redux.saga(),
    medicineModule.redux.saga(),
    workBoardModule.redux.saga(),
    workSprintModule.redux.saga(),
    workListModule.redux.saga(),
  ]);
};
