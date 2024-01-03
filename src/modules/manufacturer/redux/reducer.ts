import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

const manufacturerSlice = new InstanceModuleRedux('manufacturer');

manufacturerSlice.extendsSlice({
    getListManufacturerSuccess: (state: any, action: any) => {
        state.isLoading = false;
        state.list = action.payload;
    }
});
manufacturerSlice.extendsStates({});

const data = manufacturerSlice.createSlice();
export const manufacturerSliceAction = data.actions;
export default data.reducer;