
import { persistReducer } from 'redux-persist';

import { combineReducers } from "redux";
import localStorage from 'redux-persist/es/storage';
import authModule from '~/modules/auth';
import supplierModule from '~/modules/supplier';
import branchModule from '~/modules/branch';
import productGroupModule from '~/modules/productGroup';
import pharmacyModule from '~/modules/pharmacy';
import geoModule from '~/modules/geo';
import statusModule from '~/modules/statusConfig';
import configDiscount from '~/modules/configDiscount';
import employeeModule from '~/modules/employee';
import userModule from '~/modules/user';
import userGroupModule from '~/modules/userGroup';
import policy from '~/modules/policy';
import vouchers from '~/modules/vouchers';
import reportSupplier from '~/modules/report/reportSupplier'; //
import manufacturerModule from '~/modules/manufacturer';
import productUnitModule from '~/modules/productUnit';
import rankingModule from '~/modules/ranking';
import medicineModule from '~/modules/medicine';
import productModule from '~/modules/product';
import workBoardModule from '~/modules/workBoard';
import billModule from '~/modules/sale/bill';
import quotationModule from '~/modules/sale/quotation';
import botNotificationModule from '~/modules/botNotification';
import workSprintModule from '~/modules/workSprint';
import workListModule from '~/modules/workList';
import workTaskModule from '~/modules/workTask';
import paymentVoucher from '~/modules/paymentVoucher';
import receiptVoucher from '~/modules/receiptVoucher';
import lkModule from '~/modules/sale/lk';
import productsAll from '~/modules/productsAll';
import freelanceContractPharmacy from '~/modules/freelanceContractPharmacy';
import costManagement from '~/modules/costManagement';
import orderSupplier from '~/modules/sale/orderSupplier';
import salesGroup from '~/modules/salesGroup';
import baseSalary from '~/modules/reportSalary/baseSalary/index';
import benefitConfiguration from '~/modules/reportSalary/benefitConfiguration/index';
import reportEmployee from '~/modules/report/reportEmployee/index';
import saleChannel from '~/modules/saleChannel/index';

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
    auth: persistReducer(authPersistConfig, authModule.redux.reducer),
    supplier: supplierModule.redux.reducer,
    branch: branchModule.redux.reducer,
    geo: geoModule.redux.reducer,
    statusConfig: statusModule.redux.reducer,
    pharmacy: pharmacyModule.redux.reducer,
    employee: employeeModule.redux.reducer,
    user: userModule.redux.reducer,
    userGroup: userGroupModule.redux.reducer,
    policy: policy.redux.reducer,
    vouchers: vouchers.redux.reducer,
    productGroup:productGroupModule.redux.reducer,
    manufacturer:manufacturerModule.redux.reducer,
    productUnit:productUnitModule.redux.reducer,
    ranking:rankingModule.redux.reducer,
    medicine:medicineModule.redux.reducer,
    product:productModule.redux.reducer,
    workBoard:workBoardModule.redux.reducer,
    configDiscount: configDiscount.redux.reducer,
    bill: billModule.redux.reducer,
    quotation: quotationModule.redux.reducer,
    botNotification: botNotificationModule.redux.reducer,
    workSprint:workSprintModule.redux.reducer,
    workList:workListModule.redux.reducer,
    workTask:workTaskModule.redux.reducer,
    paymentVoucher: paymentVoucher.redux.reducer,
    receiptVoucher: receiptVoucher.redux.reducer,
    lk: lkModule.redux.reducer,
    productsAll: productsAll.redux.reducer,
    orderSupplier: orderSupplier.redux.reducer,
    freelanceContractPharmacy: freelanceContractPharmacy.redux.reducer,
    costManagement: costManagement.redux.reducer,
    salesGroup: salesGroup.redux.reducer,
    baseSalary: baseSalary.redux.reducer,
    benefitConfiguration: benefitConfiguration.redux.reducer,
    reportEmployee: reportEmployee.redux.reducer,
    reportSupplier: reportSupplier.redux.reducer,
    saleChannel: saleChannel.redux.reducer,

});
export default rootReducer