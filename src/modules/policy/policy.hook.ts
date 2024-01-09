import { get, groupBy, last } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { clearQuerySearch, getExistProp, removeAccents } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { policySliceAction } from "./redux/reducer";
import { ACTIONS } from "./policy.auth";
import { ACTIONS_REDUX, DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
import { userSliceAction } from "../user/redux/reducer";
const MODULE  = "policy";
const MODULE_VI  = "Người dùng";

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  getByIdLoadingSelector,
  getByIdSelector,
  getByIdFailedSelector,
  deleteSuccessSelector,
  deleteFailedSelector,
  isSubmitLoadingSelector,
  createSuccessSelector,
  createFailedSelector,
  updateSuccessSelector,
  updateFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);
const getSelector = (key: string) => (state: any) => state.policy[key];
const profileSelector = getSelector('profile');
const getResourcesLoadingSelector = getSelector('isGetResourcesLoading');
const resourcesSelector = getSelector('resources');
const getResourcesFailedSelector = getSelector('getResourcesFailed');

const getSelectorUser = (key: string) => (state: any) => state.user[key];
const policySelector = getSelectorUser('policy');
const isGetPolicyLoadingSelector = getSelectorUser('isGetPolicyLoading');
const getPolicyFailedSelector = getSelectorUser('getPolicyFailedSelector');

export const usePolicyPaging = () => useSelector(pagingSelector);

export const useGetPolicies = (params: any) => {
  return useFetchByParam({
    action: policySliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: params,
  });
};

export const useGetPolicy = (id: any) => {
  return useFetchByParam({
    action: policySliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreatePolicy = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: policySliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdatePolicy = () => {
  return useSubmit({
    action: policySliceAction.updateResourcesRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeletePolicy = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: policySliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

interface onPermissionChangeProps {
  group?: any
  isAssgined?: boolean
  resource?: any
  action?: any
}
export const getNewPolicies = ({group,isAssgined, resource, action}: onPermissionChangeProps) => {
  let newPolicies = {}
    if(action === 'admin'){ 
      if(isAssgined){ 
        let allowAllPermission : any = {admin : true}
        ACTIONS?.forEach((permission:any) => allowAllPermission[permission] = true) 
        newPolicies = {...group?.policies,[resource]:allowAllPermission}
      }else{ 
        newPolicies = {...group?.policies,[resource] : {}} 
      };
      }  else {
    
        newPolicies = {...group?.policies,
          [resource] : {...get(group,`policies.${resource}`), // Find Resource Action and Update
          [action] : isAssgined // Find Action and Update
        }}
    }
    return newPolicies
}

const adapterValidatePolicyname = async (policyname: any, callApi: any) => {
  const res = await callApi({ policyname: removeAccents(policyname?.toLowerCase()) }) // API Get policyname
  return get(res, 'policyname', '')
};
export const autoCreatePolicyname = async ({ fullName, callApi }: any) => {
  const splitFullName = fullName?.trim()?.split(' ')
  let policyname = last(splitFullName)
  for (let i = 0; i <= splitFullName?.length - 2; i++) {
    const value = get(splitFullName, `${i}.[0]`, '')
    policyname += value
  };
  const newPolicyName = await adapterValidatePolicyname(policyname, callApi)
  return newPolicyName
};
 
//POLICY
const isMatchPolicy = (policies : any, requiredPermission : any) => {
  return !!requiredPermission?.reduce((policy : any , permission : any )=> {
    return policy?.[permission];
  }, policies);
};


export const useMatchPolicy = (requiredPermission : any) => {
  const policies = useSelector(policySelector);
  const profile = useSelector(profileSelector);

  const isMatch = useMemo(() => {
    if (profile?.isSuperAdmin) {
      return true;
    }
    if (!requiredPermission) return true;

    if (Array.isArray(requiredPermission[0])) {
      return requiredPermission.reduce((isMatch : any , permissionItem : any ) => {
        return isMatch && isMatchPolicy(policies, permissionItem);
      }, true);
    }

    return isMatchPolicy(policies, requiredPermission);
  }, [requiredPermission, policies]);
  return isMatch;
};

export const useResources = () => {
  const { id: branchId } = useParams();

  const branchParam = useMemo(() => ({ branchId : branchId ? branchId : DEFAULT_BRANCH_ID }), [branchId]);

  return useFetchByParam({
    action: policySliceAction.getResourcesRequest,
    loadingSelector: getResourcesLoadingSelector,
    dataSelector: resourcesSelector,
    failedSelector: getResourcesFailedSelector,
    param: branchParam,
    // actionUpdate : updateResourceRedux,
  });
};

export const useMatchOrPolicy = (requiredPermission: string[][]) => {
  const policies = useSelector(policySelector);
  const profile = useSelector(profileSelector);
  const isMatch = useMemo(() => {
    if (profile?.isSuperAdmin) {
      return true;
    };
    if (!requiredPermission) return true;

    for (const permissionItem of requiredPermission) {
        if (isMatchPolicy(policies, permissionItem)) {
          return true;
        }
    }

    return isMatchPolicy(policies, requiredPermission);
  }, [requiredPermission, policies]);

  return isMatch;
};

export const useUserPolicy = () => {
  const [isLoading, handleGetPolicy] = useSubmit({
    loadingSelector: isGetPolicyLoadingSelector,
    action: userSliceAction.getPolicyRequest,
  });

  const policies = useSelector(policySelector);

  useEffect(() => {
    if (!Object.keys(policies || {}).length && !isLoading) {
      handleGetPolicy(DEFAULT_BRANCH_ID);
    }
    //eslint-disable-next-line
  }, []);

  useFailed(getPolicyFailedSelector);

  return [isLoading, handleGetPolicy, policies];
};