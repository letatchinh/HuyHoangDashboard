import { createContext, useCallback, useContext, useEffect, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import { STATUS_REQUEST_GROUP } from "./constants";
import { useChangeStatus, useCreateRequestGroup, useGetRequestGroupOfPartner, useGetRequestGroups, useRequestOfPartnerPaging } from "./requestGroup.hook";
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
  };
  const RequestGroup = createContext<GlobalRequestGroup>({
    onChangeStatus : () => {},
    data : [],
    paging : null,
    setQuery : () => {},
    createRequest : () => {},
    onUpdateStatus : () => {},
    id : null,
    loading : false,
    isSubmitLoading : false,
  });
  
  type RequestGroupProviderProps = {
    children: any;
    id?: any;
    
  };
  const useGetData = {
    one : useGetRequestGroupOfPartner,
    all : useGetRequestGroups
  }
  
  export function RequestGroupProvider({
    children,
    id,
  }: RequestGroupProviderProps): JSX.Element {
    const [q,setQ] = useState({id});
    const [idPartner,setIdPartner] = useState();
    const mutate = useCallback(() => setQ(pre => ({...pre})),[]);
    const [data,loading] = useGetData[id ? "one" : "all"](q);
    const setQuery = (newQ : any) => {
      setQ({...q,...newQ});
    };
    const paging = useRequestOfPartnerPaging();
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


    const [isSubmitLoading,createRequest] = useCreateRequestGroup(mutate);
    const [,onUpdateStatus] = useChangeStatus(mutate);


    const onChangeStatus = ({_id,status}:any) => {
      if(status === STATUS_REQUEST_GROUP.COMPLETED){
        onOpen(_id);
      }else{
        onUpdateStatus({_id,status});
      }
    };


    useEffect(() => {
      id && setQuery({id});
      setIdPartner(id);
    },[id]);

    return (
      <RequestGroup.Provider
        value={{
            onChangeStatus,
            data,
            paging,
            setQuery,
            createRequest,
            id : idPartner,
            loading,
            isSubmitLoading,
            onUpdateStatus,
        }}
      >
        {children}
        <ModalAnt footer={null} width={1000} open={openCompleted} onCancel={onClose}>
          <RequestGroupComponent.ControlChangeGroup id={idPartner} requestId={requestId}/>
        </ModalAnt>
      </RequestGroup.Provider>
    );
  }
  
  const useRequestGroupStore = (): GlobalRequestGroup => useContext(RequestGroup);
  
  export default useRequestGroupStore;
  