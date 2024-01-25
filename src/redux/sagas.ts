import { all } from 'redux-saga/effects';
import authModule from '~/modules/auth';
import supplierModule from '~/modules/supplier';
import branchModule from '~/modules/branch';
import geoModule from '~/modules/geo';
import statusModule from '~/modules/statusConfig';
import pharmacyModule from '~/modules/pharmacy';
import employeeModule from '~/modules/employee';
import userModule from '~/modules/user';
import userGroupModule from '~/modules/userGroup';
import policyModule from '~/modules/policy';
import vouchers from '~/modules/vouchers';
import productGroupModule from '~/modules/productGroup';
import manuFacturerModule from '~/modules/manufacturer';
import productUnitModule from '~/modules/productUnit';
import rankModule from '~/modules/ranking';
import medicineModule from '~/modules/medicine';
import productModule from '~/modules/product';
import workBoardModule from '~/modules/workBoard';
import configDiscountModule from '~/modules/configDiscount';
import billModule from '~/modules/sale/bill';
import quotationModule from '~/modules/sale/quotation';
import botNotification from '~/modules/botNotification';
import workSprintModule from '~/modules/workSprint';
import workListModule from '~/modules/workList';
import workTaskModule from '~/modules/workTask';
import paymentVoucher from '~/modules/paymentVoucher';
import receiptVoucher from '~/modules/receiptVoucher';
export default function* rootSaga() {
  yield all([
    authModule.redux.saga(),
    supplierModule.redux.saga(),
    branchModule.redux.saga(),
    geoModule.redux.saga(),
    statusModule.redux.saga(),
    configDiscountModule.redux.saga(),
    employeeModule.redux.saga(),
    userModule.redux.saga(),
    userGroupModule.redux.saga(),
    policyModule.redux.saga(),
    vouchers.redux.saga(),
    productGroupModule.redux.saga(),
    manuFacturerModule.redux.saga(),
    productUnitModule.redux.saga(),
    rankModule.redux.saga(),
    medicineModule.redux.saga(),
    productModule.redux.saga(),

    workBoardModule.redux.saga(),
    pharmacyModule.redux.saga(),
    // Đơn hàng
    billModule.redux.saga(),
    quotationModule.redux.saga(),
    botNotification.redux.saga(),
    workSprintModule.redux.saga(),
    workListModule.redux.saga(),
    workTaskModule.redux.saga(),
    paymentVoucher.redux.saga(),
    receiptVoucher.redux.saga(),
  ]);
};
