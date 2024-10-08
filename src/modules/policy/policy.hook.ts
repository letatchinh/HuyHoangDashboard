import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { policyType } from "./policy.modal";
import { getSelectors, useFetch, useFetchByParam, useSubmit } from "~/utils/hook";
import { policyActions } from "./redux/reducer";
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

const getSelectorAuth = (key: string) => (state: any) => state.auth[key];
const profileSelector = getSelectorAuth('profile');
const isGetResourcesLoading = getSelectorAuth('isGetResourcesLoading');
const resourcesSelector = getSelectorAuth('resources');
const getResourcesFailedSelector = getSelectorAuth('getResourcesFailed');

export const useGetPolicies = () => {
  return useFetch({
    action: policyActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
  });
};

export const useGetPermissionByStaffGroup = (params: any) => {
  return useFetchByParam({
    action: policyActions.getByIdRequest,
    loadingSelector: isSubmitLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: params,
  });
};

export const useUpdatePolicy = () => {
  return useSubmit({
    action: policyActions.updateResourcesRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const isMatchPolicy = (policies: any, requiredPermission: any) => {
  if(!policies || Object.keys(policies).length === 0) return false;
  return  Boolean(policies?.[requiredPermission?.[0]]?.includes(requiredPermission[1]))
};

export const useMatchPolicy = (requiredPermission : [string, policyType]) => {
  const policies = useSelector(listSelector);
  const profile = useSelector(profileSelector);
  const isMatch = useMemo(() => {
    if (!requiredPermission ||profile?.user?.isSuperAdmin) return true;
    return isMatchPolicy(policies, requiredPermission);

  }, [requiredPermission, policies]);
  return isMatch;
};
export const useMatchOrPolicy = (requiredPermission: [string,policyType][]) => {
  const policies = useSelector(listSelector);
  const profile = useSelector(profileSelector);
  const isMatch = useMemo(() => {
    if (!requiredPermission || profile?.user?.isSuperAdmin) return true;

    for (const permissionItem of requiredPermission) {
        if (isMatchPolicy(policies, permissionItem)) {
          return true;
        }
    }
    return false
  }, [requiredPermission, policies]);
  return isMatch;
};


export const useUpdateResourceRedux = () => {
  return useSubmit({
    action: policyActions.updateResourceRedux,
    loadingSelector: isSubmitLoadingSelector,
  });
};
// export const useUserPolicy = () => {
//   const [isLoading, handleGetPolicy] = useSubmit({
//     loadingSelector: isGetPolicyLoadingSelector,
//     action: policyActions.getPolicyRequest,
//   });

//   const policies = useSelector(policySelector);

//   useEffect(() => {
//     if (!Object.keys(policies || {}).length && !isLoading) {
//       handleGetPolicy(DEFAULT_BRANCH_ID);
//     }
//     //eslint-disable-next-line
//   }, [handleGetPolicy]);

//   useFailed(getPolicyFailedSelector);

//   return [isLoading, handleGetPolicy, policies];
// };