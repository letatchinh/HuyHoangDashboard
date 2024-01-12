import { initStateSlice } from "~/redux/models";

export type TypeProps = {
    
}

export interface FormTaskContextProps {
    setPropsModal: React.Dispatch<React.SetStateAction<any>>;
    openForm: (id: string, data: any) => void;
    boardId: string;
    boardData: any; // Replace 'any' with the actual type of boardData
    sprintId: string;
    updateTask: (params: any) => void; // Replace 'any' with the actual type of params
    handleCreateTask: () => void;
    handleDeleteWork: () => void;
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteTask: () => void;
    setVisibleInfo: React.Dispatch<React.SetStateAction<boolean>>;
    setIdVisibleInfo: React.Dispatch<React.SetStateAction<string>>;
    setTaskData: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with the actual type of taskData
    taskData: any; // Replace 'any' with the actual type of taskData
  }

  export interface cloneInitState<T = any> extends initStateSlice {
    // Add CloneInitState Type Here
    isLoadingListWorkConfig?: boolean;
    listWorkConfig?: T[];
    getListWorkConfigFailed?: any;
  }