import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

const productConfigSlice = new InstanceModuleRedux('productConfig');

productConfigSlice.extendsSlice({
    getListProductConfigSuccess: (state: any, action: any) => {
        state.isLoading = false;
        state.list = action.payload;
    }
});

productConfigSlice.extendsStates({});

const data = productConfigSlice.createSlice();
export const productConfigSliceAction = data.actions;
export default data.reducer;