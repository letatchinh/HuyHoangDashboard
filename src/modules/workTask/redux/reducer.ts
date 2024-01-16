import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  isLoadingHistory?: boolean,
  getListHistoryFailed?: any,
  listHistory?: any[],

  isLoadingManagerByBoard?: boolean,
  getListManagersFailed?: any,
  listManagersByBoard?: any[],

  assignSuccess?: any,
  assignFailed?: any,
  isLoadingAssign?: boolean,

  updateProgressSuccess?: any,
  updateProgressFailed?: any,

  isLoadingCommentList?: boolean,
  listComment?: any,
};
const calculateProgress = (progressList = []) => {
  const newProgressList = progressList?.map((progress : any) => {
      const listDone = get(progress, 'progress',[])?.filter((item: any) => !!get(item,'[1].check'));
      const progressValue = parseInt(listDone?.length ?? 0) / parseInt(get(progress, 'progress',[])?.length) * 100;
      return {...progress,progressValue : isNaN(progressValue) ? 0 : progressValue.toFixed(0)}
  })
  return newProgressList
}
class WorkTaskClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('workTask');
    this.cloneReducer = {
      ...this.initReducer,
      //GET
      getHistoryActivityTaskByIdRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingHistory = true;
        state.getListHistoryFailed = null;
      },
      getHistoryActivityTaskByIdSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingHistory = false;
        state.listHistory = payload;
      },
      getHistoryActivityTaskByIdFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingHistory = false;
        state.getListHistoryFailed = payload;
        state.listHistory = [];
      },

      getListManagersByIdBoardRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        
      },
      getListManagersByIdBoardSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        
      },
      getListManagersByIdBoardFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        
      },

      resetComment: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.listComment = [];
        state.isLoadingCommentList = false;
      },

      //CREATE

      copyTaskRequest : (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = true;
        state.createSuccess = null;
      },
      copyTaskSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
        state.createSuccess = payload;
      },
      copyTaskFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
        state.createFailed = payload;
      },

      //UPDATE

      updateProgressTaskRequest : (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = true;
        state.updateProgressFailed = null;
      },
      updateProgressTaskSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
        state.byId = {...payload,progressListShow : calculateProgress(get(payload,'progressListShow'))};
        state.updateProgressSuccess = payload;
      },
      updateProgressTaskFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
        state.updateProgressFailed = payload;
      },


      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      isLoadingHistory: false,
      getListHistoryFailed: undefined,
      listHistory: [],

      assignSuccess: null,
      assignFailed: null,
      isLoadingAssign: false,
  
      updateProgressSuccess: null,
      updateProgressFailed: null,

      isLoadingCommentList: false,
      listComment: [],
      // Want Add more State Here...
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.cloneReducer,
    });
  }
  
}

const newSlice = new WorkTaskClassExtend();
const data = newSlice.createSlice();


export const workTaskSliceAction = data.actions;
export default data.reducer;
