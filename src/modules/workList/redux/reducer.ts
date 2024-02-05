import { createSlice } from "@reduxjs/toolkit";
import { get, sortBy,omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { cloneInitState } from "../workList.modal";
class WorkListClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;

  constructor() {
    super('workList');
    this.cloneReducer = {
      ...this.initReducer,
      getListBoardConfigRequest: (state: cloneInitState) => {
        state.isLoadingListWorkConfig = true;
        state.getListWorkConfigFailed = null;
      },
      getListBoardConfigSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingListWorkConfig = false;
        state.listWorkConfig = payload;
        state.getListWorkConfigFailed = null;
      },
      getListBoardConfigFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingListWorkConfig = false;
        state.getListWorkConfigFailed = payload;
      },
      addBoardConfigItemRequest: (state: cloneInitState, { payload }: { payload: {id:string,[key:string]:any } }) => {
        // if(!state.dataBoardConfig?.[payload.id]){
        //   const id :string = payload.id;
        //   Object.assign(state.dataBoardConfig,{[id]:[]})
        // }
        state.dataBoardConfig[payload.id] = []
      },
      addBoardConfigItemSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.dataBoardConfig[payload?.id] = sortBy(payload.data, [function (o) { return o.ordinal }]);
      },
      addBoardConfigItemFaled: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.dataBoardConfig[payload.id] = []
      },
      updateTaskInitSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isSubmitLoading = false;
      const { idTask, dataTask, boardId } = payload;
      state.dataBoardConfig[boardId] = state.dataBoardConfig[boardId]?.map((item:any) => {
        if (item._id === idTask) {
          return dataTask;
        }
        return item;
      });
      },
      updatePosition: (state: cloneInitState, { payload }: { payload?: any }) => {
        var {
          colBefore,
          indexBefore,
          colAfter,
          indexAfter,
        } = payload;
  
        if (!colAfter) {
          return
        }
        if (colBefore === colAfter) {
          if (indexBefore === indexAfter) {
            return
          }
  
        }
        var valueIdxUp = get(state.dataBoardConfig[colAfter][indexAfter - 1], 'ordinal', 0);
        var valueIdxDown = get(state.dataBoardConfig[colAfter][indexAfter], 'ordinal', valueIdxUp + 10);
        var newOrdinal = (valueIdxUp + valueIdxDown) / 2;
  
        var [{ ...itemBeRemove }] = state.dataBoardConfig[colBefore].splice(indexBefore, 1);
  
        Object.assign(itemBeRemove ?? {}, { ordinal: newOrdinal });
  
  
        state.dataBoardConfig[colAfter].splice(indexAfter, 0, itemBeRemove);
      },
      updatePositionBoardConfig: (state: cloneInitState, { payload }: { payload?: any }) => {
        var {
          newData,
          destinationIndex,
          sourceIndex,
        } = payload;
        if(destinationIndex === sourceIndex) return;
        state.listWorkConfig=newData
      },
      resetAction: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list"]),
      }),
      // Want to add more reducers here...
    };

    this.cloneInitState = {
      ...this.initialState,
      isLoadingListWorkConfig: false,
      getListWorkConfigFailed: null,
      listWorkConfig: [],
      dataBoardConfig:{}
      
      // Want to add more state here...
    };
  }

  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.cloneReducer,
    });
  }
}

const newSliceWorkList = new WorkListClassExtend();
const dataWorkList = newSliceWorkList.createSlice();

export const workListActions = dataWorkList.actions;
export default dataWorkList.reducer;
