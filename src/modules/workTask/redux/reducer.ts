import { createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
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

  isloadingRelationTask?: boolean,
  listTaskRelation?: any[],
  getListTaskRelationFailed?: any,

  isUpdateRelation?: boolean,
  updateRelationSuccess?: any,
  updateRelationFailed?: any,

  isloadingSearchTask?: boolean,
  getSearchListTaskFailed?: any, 
  listTaskSearch?: any[],
  
  isLoadingComment?: boolean,
  commentSuccess?: any,
  commentFailed?: any,
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
      getByIdSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isGetByIdLoading = false;
        state.byId = {...payload,progressListShow : calculateProgress(get(payload,'progressListShow',[]))};
        state.getByIdFailed = null;
      },
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

      getRelationTaskRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isloadingRelationTask = true;
        state.updateRelationSuccess = null;
        state.updateRelationFailed = null;
      },
      getRelationTaskSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isloadingRelationTask = false;
        state.listTaskRelation = payload;
      },
      getRelationTaskFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isloadingRelationTask = false;
        state.getListTaskRelationFailed = payload;
      },

      searchTaskRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isloadingSearchTask = true;
      },
      searchTaskSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isloadingSearchTask = false;
        state.listTaskSearch = payload;
      },
      searchTaskFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isloadingSearchTask = false;
        state.getSearchListTaskFailed = payload;
      },

      //CREATE

      copyTaskRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = true;
        state.createSuccess = null;
      },
      copyTaskSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
        state.createSuccess = payload;
        state.createFailed = null;
      },
      copyTaskFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
        state.createFailed = payload;
      },

      //UPDATE
      updateSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        // console.log('1');
        state.isSubmitLoading = false;
        const data = payload;
        state.byId = {...data,progressListShow : calculateProgress(get(data,'progressListShow'))};
        state.updateSuccess = payload;
      },
      updateProgressTaskRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = true;
        state.updateProgressFailed = null;
      },
      updateProgressTaskSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
        state.byId = { ...payload, progressListShow: calculateProgress(get(payload, 'progressListShow')) };
        state.updateProgressSuccess = payload;
      },
      updateProgressTaskFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
        state.updateProgressFailed = payload;
      },

      updateRelationTaskRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isUpdateRelation = true;
        state.updateRelationSuccess = null;
        state.updateRelationFailed = null;
      },
      updateRelationTaskSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isUpdateRelation = false;
        state.updateRelationSuccess = payload;
      },
      updateRelationTaskFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isUpdateRelation = false;
        state.updateRelationFailed = payload;
      },

      assignTaskRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingAssign = true;
        state.assignFailed = null;
      },
      assignTaskSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingAssign = false;
        state.byId = { ...state.byId, assignUser: get(payload, 'data.assignUser') }
        state.assignSuccess = payload;
      },
      assignTaskFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingAssign = false;
        state.assignFailed = payload;
      },

      commentList: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.listComment = [...state.listComment, ...payload]
      },
      commentPush: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.listComment = [payload, ...state.listComment];
      },
      commentEmotion: (state: cloneInitState, { payload }: { payload?: any }) => {
        const index = state.listComment.findIndex((item: any) => item._id === payload._id)
        if (index < 0) {
          state.listComment = [payload, ...state.listComment]
        } else {
          state.listComment[index] = payload
        };
      },
      updateComment: (state: cloneInitState, { payload }: { payload?: any }) => {
        const index = state.listComment.findIndex((item: any) => item._id === payload._id)
        if (index >= 0) {
          state.listComment[index] = payload;
        }
      },

      commentRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingComment = true;
        state.commentFailed= null;
      },
      commentSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingComment = false;
        state.commentSuccess = payload;
      },
      commentFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingComment = false;
        state.commentFailed = payload;
      },

      pushEmotionRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
         // not set state
      },

      commentUpdateRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        // not set state
       },

      //DELETE
      deleteComment: (state: cloneInitState, { payload }: { payload?: any }) => {
        const index = state.listComment.findIndex((item: any)=>item._id===payload._id)
          if(index>=0){
            state.listComment.splice(index, 1)
          }
      },
      deleteCommentRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
       // not set state
      },

      //RESET
      resetComment: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.listComment = [];
        state.isLoadingCommentList = false;
      },
      commentReset: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.listComment = [];
      },
      resetAction: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list","byId"]),
      }),

      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      isLoadingHistory: false,
      getListHistoryFailed: undefined,
      listHistory: [],

      isLoadingAssign: false,
      assignSuccess: null,
      assignFailed: null,
  
      updateProgressSuccess: null,
      updateProgressFailed: null,

      isLoadingCommentList: false,
      listComment: [],

      listTaskRelation: [],
      isloadingRelationTask: false,
      getListTaskRelationFailed: null,
      
      isUpdateRelation: false,
      updateRelationSuccess: null,
      updateRelationFailed: null,

      listTaskSearch: [],
      isloadingSearchTask: false,
      getSearchListTaskFailed: null,
      
      isLoadingComment: false,
      commentSuccess: null,
      commentFailed: null,      
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
