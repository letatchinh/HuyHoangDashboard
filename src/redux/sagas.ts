import {all} from 'redux-saga/effects';
import authModule from '~/modules/auth';
import supplierModule from '~/modules/supplier';
import branchModule from '~/modules/branch';
import geoModule from '~/modules/geo';
import productConfigModule from '~/modules/productConfig';
import manuFacturerModule from '~/modules/manufacturer';
import productUnitModule from '~/modules/productUnit';
import rankModule from '~/modules/ranking';
import medicineModule from '~/modules/medicine';
import productModule from '~/modules/product';
import pharmacyModule from '~/modules/pharmacy';
export default function* rootSaga() {
  yield all([
    authModule.redux.saga(),
    supplierModule.redux.saga(),
    branchModule.redux.saga(),
    geoModule.redux.saga(),
    productConfigModule.redux.saga(),
    manuFacturerModule.redux.saga(),
    productUnitModule.redux.saga(),
    rankModule.redux.saga(),
    medicineModule.redux.saga(),
    productModule.redux.saga(),

    pharmacyModule.redux.saga(),
  ]);
}
