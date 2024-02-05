import { geo } from './../geo/redux/reducer';
import { initStateSlice } from "~/redux/models";

export type TypeProps = {
    
}
export interface BOARD_SECURITY_TYPE {
    public:string
    private:string
}
export interface cloneInitState<T = any> extends initStateSlice {
    isLoadingGetAllManagers?: boolean;
    getAllManagersFailed?: any;
    allManagers?: T[];
    // isLoadingGetAllManagersByIdT?: boolean;
    // getAllManagersFailed?: any;
    // allManagers?: T[];
    isLoadingGetAllEmployee?: boolean;
    getAllEmployeeFailed?: any;
    allEmployee?: T[];

    isLoadingGetListManagerById?: boolean;
    getListManagerByIdFailed?: any;
    listManagerById?: T[];

    isLoadingListEmployeeById?: boolean;
    getListEmployeeByIdFailed?: any;
    listEmployeeById?: T[];
    
    isGetListBoard?: boolean;
    getListBoardFailed?: any;
    listBoard?: T[];


  }
export interface PERMISSION {
    _id: string;
    id:string;
    fullName: string;
}

export interface DataType {
    _id: string;
    name: string;
    createBy: string;
    createAt: Date;
    status: string,
    userCreate?:any,
  }
