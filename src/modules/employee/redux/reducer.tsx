import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

// InstanceModuleRedux
const employeeSlice = new InstanceModuleRedux('employee');


/**
 * Want to ADD more Slice or EXTEND for this module use This
 */
employeeSlice.extendsSlice({
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
employeeSlice.extendsStates({});


// Start Create Slice
const data = employeeSlice.createSlice();

// export action and Reducer;

// Want Suggettion ?
// interface reducerType  extends voidReducer {
//     // onR? : (state:any) => void
// }
export const employeeSliceAction = data.actions;
export default data.reducer;