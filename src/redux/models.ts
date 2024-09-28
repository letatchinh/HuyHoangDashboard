export type initStateSlice<T=any> = {
    isLoading?: boolean;
    list?: T[];
    listSearch?: T[];
    getListFailed?: any;

    paging?: Partial<{
      current: number,
      pageSize:number,
      total: number,
    }>|null;

    createSuccess?: any;
    createFailed?: any;
  
    updateSuccess?: any;
    updateFailed?: any;
  
    deleteSuccess?: any;
    deleteFailed?: any;
  
    submitSuccess?: any;
    submitFailed?: any;
  
    isSubmitLoading?: any;
  
    byId?: any;
    isGetByIdLoading?: boolean;
    getByIdFailed?: any;
  };

    
  export type ModuleRedux = 
  "course"
  | "schedule"
  | "scheduleItem"

  export interface voidReducer {
    getListRequest : (state:any,payload?:any) => any;
    getListSuccess:(state:any,payload?:any)=>any;
    getListFailed:(state:any,payload?:any)=>any;
    getByIdRequest : (state:any,payload?:any) => any;
    getByIdSuccess:(state:any,payload?:any)=>any;
    getByIdFailed:(state:any,payload?:any)=>any;
    createRequest:(state:any,payload?:any)=>any;
    createSuccess:(state:any,payload?:any)=>any;
    createFailed:(state:any,payload?:any)=>any;
    updateRequest:(state:any,payload?:any)=>any;
    updateSuccess:(state:any,payload?:any)=>any;
    updateFailed:(state:any,payload?:any)=>any;
    deleteRequest:(state:any,payload?:any)=>any;
    deleteSuccess:(state:any,payload?:any)=>any;
    deleteFailed:(state:any,payload?:any)=>any;
    getRequest:(state:any,payload?:any)=>any;
    getSuccess:(state:any,payload?:any)=>any;
    getFailed:(state:any,payload?:any)=>any;
    onSearch:(state:any,payload?:any)=>any;
    resetAction:(state:any,payload?:any)=>any;
    reset: () => any;
  }
