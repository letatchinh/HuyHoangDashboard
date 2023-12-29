import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

// InstanceModuleRedux
const branchSlice = new InstanceModuleRedux('branch');


/**
 * Want to ADD more Slice or EXTEND for this module use This
 */
branchSlice.extendsSlice({
    getListSuccess: (state:any, { payload }:any) => {
        state.isLoading = false;
        state.list = payload;
      },
});


/**
 * 
 * 
 * Want to Add more State for this module use This
 */
branchSlice.extendsStates({});


// Start Create Slice
const data = branchSlice.createSlice();

// export action and Reducer;

// Want Suggettion ?
// interface reducerType  extends voidReducer {
//     // onR? : (state:any) => void
// }
export const branchSliceAction = data.actions;
export default data.reducer;