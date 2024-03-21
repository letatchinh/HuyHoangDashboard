import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ACTIONS_REDUX } from "~/constants/defaultValue";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class EmployeeGroupClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('employeeGroup');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
        state.paging = getPaging(payload);
      },
      updatePolicyById: (state: initStateSlice, { payload }: any) => {
        var policies = state.byId?.policies?.[payload.resource] ?? [];
        var pAction = payload.action;
        var isAssgined = payload.isAssgined;
        const handleAction = (pAction: string, param: any = undefined) => {
          if (!Boolean(Object.hasOwn(state.byId.policies, payload.resource))) {
            Object.assign(state.byId.policies, { [payload.resource]: [] })
          };
          state.byId.policies[payload.resource] = param ?? ((policies?.includes(pAction)) ? policies?.filter((action: any) => action !== pAction) : policies.concat(pAction));
          return;
        };
        if (pAction === 'admin') {
          handleAction('' ,isAssgined?ACTIONS_REDUX:[] )
          return;
        };

        handleAction(pAction);
      },
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.cloneReducer,
    });
  }
  
}

const newSlice = new EmployeeGroupClassExtend();
const data = newSlice.createSlice();


export const employeeGroupActions = data.actions;
export default data.reducer;
