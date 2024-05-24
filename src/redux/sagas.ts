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
import lkModule from '~/modules/sale/lk';
import productsAllModule from '~/modules/productsAll';
import freelanceContractPharmacy from '~/modules/freelanceContractPharmacy';
import costManagement from '~/modules/costManagement';
import orderSupplier from '~/modules/sale/orderSupplier';
import salesGroup from '~/modules/salesGroup';
import baseSalary from '~/modules/reportSalary/baseSalary/index';
import benefitConfiguration from '~/modules/reportSalary/benefitConfiguration/index';
import reportEmployee from '~/modules/report/reportEmployee/index';
import employeeGroup from '~/modules/employeeGroup/index';
import cronSalary from '~/modules/cronSalary/index';

import saleChannel from '~/modules/saleChannel';
import reportSupplierModule from '~/modules/report/reportSupplier'; //
import configurationCronTime from "~/modules/configurationCronTime";
import typePharmacy from '~/modules/typePharmacy';
import groupPharmacy from '~/modules/groupPharmacy';
import notification from '~/modules/notification';
import collaborator from '~/modules/collaborator';
import collaboratorGroup from '~/modules/collaboratorGroup';
import reportSalaryPartner from '~/modules/reportSalaryPartner/redux/saga';
import reportProductSupplier from '~/modules/reportProductSupplier';
import reportOverview from '~/modules/reportOverview';
import requestGroup from '~/modules/requestGroup';

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
    lkModule.redux.saga(),
    productsAllModule.redux.saga(),
    orderSupplier.redux.saga(),
    productUnitModule.redux.saga(),
    freelanceContractPharmacy.redux.saga(),
    costManagement.redux.saga(),
    salesGroup.redux.saga(),
    baseSalary.redux.saga(),
    benefitConfiguration.redux.saga(),
    reportEmployee.redux.saga(),
    employeeGroup.redux.saga(),
    cronSalary.redux.saga(),
    reportSupplierModule.redux.saga(),
    saleChannel.redux.saga(),
    configurationCronTime.redux.saga(),
    typePharmacy.redux.saga(),
    groupPharmacy.redux.saga(),
    productUnitModule.redux.saga(),
    notification.redux.saga(),
    collaborator.redux.saga(),
    collaboratorGroup.redux.saga(),
    reportSalaryPartner(),
    reportProductSupplier.redux.saga(),
    reportOverview.redux.saga(),
    requestGroup.redux.saga(),
  ]);
};
