import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";


const data = createSlice({
    name: 'test',
    initialState: {
        ...InstanceModuleRedux.initialState
    },
    reducers: {
        ...InstanceModuleRedux.initReducer
    }
})
export const testActions = data.actions;
export default data.reducer