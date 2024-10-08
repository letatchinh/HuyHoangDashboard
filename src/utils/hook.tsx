import { get, isNil, union } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ModuleRedux } from '~/redux/models';
import { RootState } from '~/redux/store';
import useNotificationStore from '~/store/NotificationContext';
import { StringToSlug } from './helpers';
import { ErrorAntBase } from './Modal';
import { Alert } from 'antd';

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
  reFetch?: boolean;
  listSearchSelector?:any
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
    reFetch,
  } = props;

  const dispatch = useDispatch();
  const data = useSelector(dataSelector);
  const isLoading = useSelector(loadingSelector);

  useEffect(() => {
    if (param) dispatch(action(param));
  }, [dispatch, action, param,reFetch]);

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
    callbackSubmit? : (p?:any) => void // Callback After Submit
  }

export const useSubmit = ({ loadingSelector, action ,callbackSubmit}:UseSubmitProps) : [boolean,(v:any) => void] => {
    const dispatch = useDispatch();
    const isLoading = useSelector(loadingSelector);
  
    const handleSubmit = useCallback((values:any) => {
      if(callbackSubmit && typeof callbackSubmit === 'function'){
        dispatch(action({...values,callbackSubmit}));
      }else{
        dispatch(action(values));
      }
    },[callbackSubmit,dispatch,action]);
  
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
  export const getSelector = (key : string,moduleName : ModuleRedux) => (state:RootState) => get(state,[moduleName,key]);

  export const getSelectors = (moduleName:ModuleRedux) => {
    const getSelector = (key : string) => (state:RootState) => get(state,[moduleName,key]);
  
    return {
      loadingSelector: getSelector('isLoading'),
      listSelector: getSelector('list'),
      listSearchSelector: getSelector('listSearch'),
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
      pagingSelector: getSelector('paging'),
    };
  };
  

  export const useCheckIsEllipsisActive = (target:any) => {
    const isEllipsisActive = useCallback((e:any) =>{
      if(!e) return false;
      const parentNode = e?.parentNode;
      return (e?.offsetWidth > parentNode?.offsetWidth);
  },[])
    const [isEllipsis,setIsEllipsis] = useState(false);
    useEffect(() => {
        const is = isEllipsisActive(target?.current);
        setIsEllipsis(is);
    },[target]);
    return isEllipsis
  }

  export const useTags = (initialState = []) : any => {
    const [state, setState] = useState(initialState);
    const setUniqueState = (newState : any) => {
      setState(union(newState));
    };
    return [state, setUniqueState];
  };
  type OptionsChangeDocumentType = {
    dependency : any[]
  }
  export const useChangeDocumentTitle = (title : string,options? :OptionsChangeDocumentType ) => {
    const dependency = useMemo(() => options?.dependency ?? [],[options?.dependency])
    useEffect(() => {
      document.title = title ?? "WorldPharma";
      return () => {
        document.title = "WorldPharma";
      }
    },dependency)
  }


  export const onSearchPermissions = (keyword: string = '', resource: any[] = [], updateResources: (data: any) => void) => {
    if (isNil(keyword) || keyword === '') return updateResources(resource);
    const resultSearch = resource?.filter(item => {
      return StringToSlug(get(item, 'name', '')?.toLowerCase())?.includes(StringToSlug(keyword?.trim()?.toLowerCase()));
    });
    updateResources(resultSearch);
  };
  
  export const useFailedAnt = () => {
    const [errors,setErrors] = useState<ErrorAntBase[]>([]);

    const onFinishFailed = (valuesFailed: any) => {
      const {errorFields} = valuesFailed;
      setErrors(errorFields);
    };
    const ErrorComponent = () => errors?.length ? <Alert showIcon type="error" description={errors?.map((item:ErrorAntBase) => <p>* {item?.errors?.[0]}</p>)}/> : null

    return {errors,onFinishFailed,ErrorComponent}
  }