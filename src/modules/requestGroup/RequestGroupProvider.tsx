import { createContext, useCallback, useContext, useEffect, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import { STATUS_REQUEST_GROUP } from "./constants";
import { useChangeStatus, useCreateRequestGroup, useGetRequestGroupOfPartner, useGetRequestGroups, useRequestGroupPaging, useRequestOfPartnerPaging } from "./requestGroup.hook";
import { RequestGroupSubmitType } from "./requestGroup.modal";
import RequestGroupComponent from "~/modules/requestGroup/components";

  export type GlobalRequestGroup = {
    onChangeStatus : (p?:{_id :any,status : keyof typeof STATUS_REQUEST_GROUP}) => void;
    data : RequestGroupSubmitType[] | any;
    paging : any;
    setQuery : (p:any) => void;
    createRequest : (p:any) => void;
    id? : any;
    loading? : any;
    isSubmitLoading? : any;
    onUpdateStatus : (p:any) => void; 
    onSelectPartner : (p:any) => void; 
  };
  const RequestGroup = createContext<GlobalRequestGroup>({
    onChangeStatus : () => {},
    data : [],
    paging : null,
    setQuery : () => {},
    createRequest : () => {},
    onUpdateStatus : () => {},
    onSelectPartner : () => {},
    id : null,
    loading : false,
    isSubmitLoading : false,
  });
  
  type RequestGroupProviderProps = {
    children: any;
    id?: any;
    mode : 'all' | 'one'
  };
  const useGetData = {
    one : useGetRequestGroupOfPartner,
    all : useGetRequestGroups
  };
  const usePaging = {
    one : useRequestOfPartnerPaging,
    all : useRequestGroupPaging
  };
  
  export function RequestGroupProvider({
    children,
    id,
    mode,

  }: RequestGroupProviderProps): JSX.Element {
    const [queryParams,setQueryParams] = useState(mode === 'all' ? {page : 1, limit : 10} : null);
    const [partnerId,setPartnerId] = useState();
    console.log(partnerId,'partnerId');
    
    const [data,loading] = useGetData[mode](queryParams);
    console.log(queryParams,'queryParams');
    
    const setQuery = (newQuery : any) => {
      setQueryParams({...queryParams,...newQuery});
    };
    const paging = usePaging[mode]();
    const [requestId,setRequestId] = useState<any>();
    const [openCompleted,setOpenCompleted] = useState(false);
    const onOpen = useCallback((reqId:any) => {
      setOpenCompleted(true);
      setRequestId(reqId);
    },[]);
    const onClose = useCallback(() => {
      setOpenCompleted(false);
      setRequestId(null);
    },[]);

    const mutate = useCallback(() => {
      setQueryParams((pre : any) => ({...(pre)}));
      onClose();
    },[]);

    const [isSubmitLoading,createRequest] = useCreateRequestGroup(mutate);
    const [,onUpdateStatus] = useChangeStatus(mutate);

    const onSelectPartner = (newId : any) => {
      if(mode === 'all'){
        setPartnerId(newId);
      }
    }
    const onChangeStatus = ({_id,status}:any) => {
      if(status === STATUS_REQUEST_GROUP.COMPLETED){
        onOpen(_id);
      }else{
        onUpdateStatus({_id,status});
      }
    };


    useEffect(() => {
      if(mode === 'all') {
        // id && setIdPartner(id);
      }
      if(mode === 'one'){
        id && setQuery({id});
      }
      setPartnerId(id)
    
    },[id]);

    return (
      <RequestGroup.Provider
        value={{
            onChangeStatus,
            data,
            paging,
            setQuery,
            createRequest,
            id : partnerId,
            loading,
            isSubmitLoading,
            onUpdateStatus,
            onSelectPartner,
        }}
      >
        {children}
        <ModalAnt destroyOnClose footer={null} width={1000} open={openCompleted} onCancel={onClose}>
          <RequestGroupComponent.ControlChangeGroup requestId={requestId}/>
        </ModalAnt>
      </RequestGroup.Provider>
    );
  }
  
  const useRequestGroupStore = (): GlobalRequestGroup => useContext(RequestGroup);
  
  export default useRequestGroupStore;
  