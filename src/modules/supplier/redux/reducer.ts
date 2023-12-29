import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

// InstanceModuleRedux
const supplierSlice = new InstanceModuleRedux('supplier');


/**
 * Want to Add more Slice for this module use This
 */
supplierSlice.extendsSlice({});


/**
 * 
 * 
 * Want to Add more State for this module use This
 */
supplierSlice.extendsStates({});


// Start Create Slice
const data = supplierSlice.createSlice();

// export action and Reducer;

// Want Suggettion ?
// interface reducerType  extends voidReducer {
//     // onR? : (state:any) => void
// }
export const supplierSliceAction = data.actions;
export default data.reducer;