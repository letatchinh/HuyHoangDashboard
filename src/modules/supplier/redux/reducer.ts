import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { voidReducer } from "~/redux/models";
import { getPaging } from "~/utils/helpers";

// InstanceModuleRedux
const supplierSlice = new InstanceModuleRedux("supplier");

/**
 * Want to Add more Slice for this module use This
 */
supplierSlice.extendsSlice({
  // Get ProductSupplier
  getProductSupplierRequest: (state: any) => {
    state.isLoadingGetProductSupplier = true;
    state.getProductSupplierFailed = null;
  },
  getProductSupplierSuccess: (state: any, { payload }: any) => {
    state.isLoadingGetProductSupplier = false;
    state.productSupplier = get(payload, "docs", []);
    state.pagingProductSupplier = getPaging(payload);
  },
  getProductSupplierFailed: (state: any, { payload }: any) => {
    state.isLoadingGetProductSupplier = false;
    state.getProductSupplierFailed = payload;
  },

});

/**
 *
 *
 * Want to Add more State for this module use This
 */
supplierSlice.extendsStates({
    isLoadingGetProductSupplier : false,
    getProductSupplierFailed : null,
    productSupplier : [],
    pagingProductSupplier : null

});

// Start Create Slice
const data = supplierSlice.createSlice();

// export action and Reducer;

// Extend InterFace
interface reducerType  extends voidReducer {
  getProductSupplierRequest? : (state:any,payload?:any) => any,
  getProductSupplierSuccess? : (state:any,payload?:any) => any,
  getProductSupplierFailed? : (state:any,payload?:any) => any,
}
export const supplierSliceAction : reducerType = data.actions;
export default data.reducer;
