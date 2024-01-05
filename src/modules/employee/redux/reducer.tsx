import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

// InstanceModuleRedux
const employeeSlice = new InstanceModuleRedux('employee');


/**
 * Want to ADD more Slice or EXTEND for this module use This
 */
employeeSlice.extendsSlice({
  getListSuccess: (state: any, { payload }: any) => {
        state.isLoading = false;
        state.list = get(payload, 'docs');
  },
  updateSuccess: (state: { isSubmitLoading: boolean; updateSuccess: any; list: any }, { payload }: any) => {
    state.isSubmitLoading = false;
    state.updateSuccess = payload;
    state.list = state.list.map((item: any) => {
      if (item._id === payload.data._id) {
        return { ...item, ...payload.data };
      }
      return item;
    });
    return;
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