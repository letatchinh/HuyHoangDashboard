import { get } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ModuleRedux } from '~/redux/models';
import { RootState } from '~/redux/store';
import useNotificationStore from '~/store/NotificationContext';

type SuccessSelector = (state: RootState) => any;
type FailedSelector = (state: RootState) => any;
type ActionUpdateFunction = (dataUpdate: any) => void;

export const useSuccess = (
  successSelector: SuccessSelector,
  mess?: string | undefined,
  onSuccess?: (success: any) => void
): void => {
    const {onNotify} = useNotificationStore();
  const success = useSelector(successSelector);
  useEffect(() => {
    if (success) {
      if (mess) {
        onNotify?.success(mess)
      }

      if (onSuccess) {
        onSuccess(success)
      };
    }
  }, [success, mess, onSuccess]);
};

export const useFailed = (
  failedSelector: FailedSelector,
  mess?: string | undefined,
  onFailed?: (failed: any) => void,
  mute = false
): void => {
  const failed = useSelector(failedSelector);
  const {onNotify} = useNotificationStore();
  useEffect(() => {
    if (failed && !mute) {
        onNotify?.error(
        mess || failed?.response?.data?.message || 'Something went wrong!',
      );
    }

    if (onFailed) onFailed(failed);
  }, [failed, mess, mute, onFailed, onNotify]);
};

interface UseFetchProps {
  action: any;
  dataSelector: SuccessSelector;
  failedSelector: FailedSelector;
  loadingSelector: SuccessSelector;
  payload?: any;
}

export const useFetch = (props: UseFetchProps): [any, boolean] => {
  const { action, dataSelector, failedSelector, loadingSelector, payload } = props;

  const dispatch = useDispatch();
  const data = useSelector(dataSelector);
  const isLoading = useSelector(loadingSelector);

  useEffect(() => {
    dispatch(action());
  }, [dispatch, action, payload]);

  useFailed(failedSelector);

  return [data, isLoading];
};

interface UseFetchByParamProps extends UseFetchProps {
  param?: any;
  muteOnFailed?: boolean;
  actionUpdate?: any;
}

export const useFetchByParam = (props: UseFetchByParamProps): [any, boolean, ActionUpdateFunction] => {
  const {
    action,
    dataSelector,
    failedSelector,
    loadingSelector,
    param,
    muteOnFailed,
    actionUpdate,
  } = props;

  const dispatch = useDispatch();
  const data = useSelector(dataSelector);
  const isLoading = useSelector(loadingSelector);

  useEffect(() => {
    if (param) dispatch(action(param));
  }, [dispatch, action, param]);

  useFailed(failedSelector, undefined, undefined, muteOnFailed);

  const useUpdateData: ActionUpdateFunction = (dataUpdate) => {
    if (actionUpdate && typeof actionUpdate === 'function') {
      dispatch(actionUpdate(dataUpdate));
    }
  };

  return [data, isLoading, useUpdateData];
};

interface UseSubmitProps {
    loadingSelector: (state: any) => boolean; // Adjust the state type based on your Redux store
    action: any // Adjust the values type based on your action requirements
    callback? : (p?:any) => void // Callback After Submit
  }

export const useSubmit = ({ loadingSelector, action ,callback}:UseSubmitProps) : [boolean,(v:any) => void] => {
    const dispatch = useDispatch();
    const isLoading = useSelector(loadingSelector);
  
    const handleSubmit = (values:any) => {
      if(callback && typeof callback === 'function'){
        dispatch(action({...values,callback}));
      }else{
        dispatch(action(values));
      }
    };
  
    return [isLoading, handleSubmit];
  };

interface UseActionProps {
    action: any // Adjust the values type based on your action requirements
  }

export const useAction = ({ action }:UseActionProps) : (v:any) => void => {
    const dispatch = useDispatch();
  
    const handleAction = (values:any) => {
      dispatch(action(values));
    };
  
    return handleAction;
  };
  
  
  
  export const useQueryParams = () => {
    return new URLSearchParams(useLocation().search);
  };
  
  export const useResetState = (resetAction:any) => {
    const dispatch = useDispatch();
    useEffect(() => {
      return () => {
        dispatch(resetAction());
      };
    }, [dispatch, resetAction]);
  };

  export const getSelectors = (moduleName:ModuleRedux) => {
    const getSelector = (key : string) => (state:RootState) => state[moduleName][key];
  
    return {
      loadingSelector: getSelector('isLoading'),
      listSelector: getSelector('list'),
      getListFailedSelector: getSelector('getListFailed'),
  
      getByIdLoadingSelector: getSelector('isGetByIdLoading'),
      getByIdSelector: getSelector('byId'),
      getByIdFailedSelector: getSelector('getByIdFailed'),
  
      deleteSuccessSelector: getSelector('deleteSuccess'),
      deleteFailedSelector: getSelector('deleteFailed'),
  
      isSubmitLoadingSelector: getSelector('isSubmitLoading'),
      createSuccessSelector: getSelector('createSuccess'),
      createFailedSelector: getSelector('createFailed'),
  
      updateSuccessSelector: getSelector('updateSuccess'),
      updateFailedSelector: getSelector('updateFailed'),
      pagingSelector: getSelector('paging')
    };
  };
  
  type ParamsUseFetchState = {
    api : any,
    query : any,
    useDocs ?: boolean,
  }
  // export const useFetchState = ({api,query,useDocs}:ParamsUseFetchState) => {
  //   const[data,setData] = useState([]);
  //   const [isLoading,setIsLoading] = useState(false);
  //   const {onNotify} = useNotificationStore();
  //   useEffect(() => {
  //     const fetch = async() => {
  //       try {
  //         const res = await api(query);
  //         if(useDocs){

  //         }
  //       } catch (error : any) {
  //         console.log(error);
  //         onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra")
  //       }
  //     }
  //   },[])
  // }
  interface FetchStateParams {
    api: (query: any) => Promise<any>;
    query?: any;
    useDocs?: boolean;
    init?: any[];
    fieldGet?: string;
    reFetch?: any; // Adjust the type based on your specific requirements
    nullNotFetch?: boolean;
    conditionRun?: boolean;
  }
  export const useFetchState = ({ api, query, useDocs = true, init = [], fieldGet,reFetch,nullNotFetch = false ,conditionRun = false} : FetchStateParams) : any => {
    const [data, setData] = useState(init);
    const [loading, setLoading] = useState(false);
    const req = useCallback(api, [api]);
    const fetch = useCallback(async () => {
      try {
        setLoading(true);
        const response = await req(query);
        if (fieldGet) {
          setData(get(response, fieldGet))
        } else {
          if (useDocs) {
            setData(get(response, 'docs', []));
          } else {
            setData(response);
          }
        }
  
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }, [query,reFetch])
    useEffect(() => {
      if(conditionRun){
        fetch()
      }else{
        if(nullNotFetch){
          !!query && fetch();
        }else{
          fetch()
        }
      }
    }, [fetch,nullNotFetch,query]);
    const dataReturn = useMemo(() => data, [data])
    return [dataReturn, loading]
  };