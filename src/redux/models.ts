export type initStateSlice = {
    isLoading: boolean;
    list: [];
    listSearch: [];
    getListFailed: any;

    paging : any;

    createSuccess: any;
    createFailed: any;
  
    updateSuccess: any;
    updateFailed: any;
  
    deleteSuccess: any;
    deleteFailed: any;
  
    submitSuccess: any;
    submitFailed: any;
  
    isSubmitLoading: boolean;
  
    byId: any;
    isGetByIdLoading: boolean;
    getByIdFailed: any;
  };

  const moduleRedux ={
    auth:'auth',
    supplier:'supplier',
    branch:'branch',
    geo:'geo',
    productConfig:'productConfig',
    }as const
    
    
  export type ModuleRedux = keyof typeof moduleRedux;