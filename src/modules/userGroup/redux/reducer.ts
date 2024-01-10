import { createSlice } from "@reduxjs/toolkit";
import { ACTIONS_REDUX } from "~/constants/defaultValue";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

class UserClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('userGroup');
    this.clone = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice, { payload }: any) => {
        state.list = payload;
        state.isLoading = false;
      },
      updatePolicyById: (state: initStateSlice, { payload }: any) => {
        var policies = state.byId?.policies?.[payload.resource];
        var pAction = payload.action;
        var isAssgined = payload.isAssgined;
        const handleAction = (pAction: string, param:any=undefined) => {
          if (!Boolean(Object.hasOwn(state.byId.policies, payload.resource))) {
              Object.assign(state.byId.policies,{[payload.resource]:[]})
          }
          state.byId.policies[payload.resource] = param ?? ((policies.includes(pAction)) ? policies.filter((action: any) => action !== pAction) : policies.concat(pAction))
          return 
        }
        if (pAction === 'admin') {
          handleAction('' ,isAssgined?ACTIONS_REDUX:[] )
          return
        }

        handleAction(pAction);

      },
      // Want Add more reducer Here...
    };


    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
    };
    // Object.assign(this.cloneInitState,addState);
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.clone,
    });
  }
  
}

const newSlice = new UserClassExtend();
const data = newSlice.createSlice();


export const userGroupSliceAction = data.actions;
export default data.reducer;