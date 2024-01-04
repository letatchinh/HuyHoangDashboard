import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

// InstanceModuleRedux
const userSlice = new InstanceModuleRedux('user');


/**
 * Want to ADD more Slice or EXTEND for this module use This
 */
userSlice.extendsSlice({
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
userSlice.extendsStates({});


// Start Create Slice
const data = userSlice.createSlice();

// export action and Reducer;

// Want Suggettion ?
// interface reducerType  extends voidReducer {
//     // onR? : (state:any) => void
// }
export const userSliceAction = data.actions;
export default data.reducer;