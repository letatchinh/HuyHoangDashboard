import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
import { STATUS_READ } from "../notification.modal";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  countUnread?: any;
};
class NotificationClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('notification');
    this.cloneReducer = {
      ...this.initReducer,
      getNotificationRequest: (state: cloneInitState) => {
        state.isLoading = true;
        state.getListFailed = null;
      },
      getNotificationSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.list = get(payload, 'docs', []);
        state.paging = getPaging(payload);
        state.countUnread = get(payload, 'countUnread', 0);
      },
      getNotificationFailed: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.getListFailed = payload;
      },
      changeNotificationRequest: (state: cloneInitState) => {
        state.isLoading = true;
      },
      changeNotificationSuccess: (state: cloneInitState, { payload }: any) => {
        state.list = state.list?.map((notification: any) => {
          const isExist = payload?.includes(get(notification, '_id'))
          if (isExist) {
            return { ...notification, status: STATUS_READ.read }
          } else {
            return notification;
          }})
      },
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      countUnread: 0,
    

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

const newSlice = new NotificationClassExtend();
const data = newSlice.createSlice();


export const notificationSliceActions = data.actions;
export default data.reducer;
