import {
    createContext,
    ReactNode, useContext, useMemo
} from "react";
import { useFetchState } from "~/utils/helpers";
import { useGetRole } from "../auth/auth.hook";
import apis from "./collaborator.api";
import { useAddProductEmployee, useGetEmployee, useRemoveProductEmployee, useUpdateProductEmployee } from "../employee/employee.hook";
import { useAddProductCollaborator, useGetCollaborator, useRemoveProductCollaborator, useUpdateProductCollaborator } from "./collaborator.hook";
  export type GlobalCollaboratorProduct = {
    canAdd : boolean,
    canUpdate : boolean,
    canDelete : boolean,
    target :  'employee' | 'partner',
    useAdd:()=>void,
    useUpdate:()=>void,
    useRemove:()=>void,
    useGetTarget:(param?:any)=>void,
  };
  const CollaboratorProduct = createContext<GlobalCollaboratorProduct>({
    canAdd : false,
    canUpdate : false,
    canDelete : false,
    target :  'employee',
    useAdd:()=>{},
    useUpdate:()=>{},
    useRemove:()=>{},
    useGetTarget:(param?:any)=>{},
  });
  
  type CollaboratorProductProviderProps = {
    children: ReactNode;
    id : string;
    target : 'employee' | 'partner'
  };
  const hookAdd = {
    employee : useAddProductEmployee,
    partner: useAddProductCollaborator
  }
  const hookUpdate = {
    employee : useUpdateProductEmployee,
    partner: useUpdateProductCollaborator
  }
  const hookRemove = {
    employee : useRemoveProductEmployee,
    partner: useRemoveProductCollaborator
  }
  const hookGetTarget = {
    employee : useGetEmployee,
    partner: useGetCollaborator
  }
  
  export function CollaboratorProductProvider({
    children,
    id,
    target,
  }: CollaboratorProductProviderProps): JSX.Element {
    const query = useMemo(() => ({target,id}),[target,id])
    const [{canAdd,canUpdate,canDelete},loading] = useFetchState({api : apis.getAccessProduct,query,useDocs : false})
    
    return (
      <CollaboratorProduct.Provider
        value={{
            canAdd,
            canUpdate,
            canDelete,
            target,
            useAdd : hookAdd[target],
            useUpdate: hookUpdate[target],
            useRemove: hookRemove[target],
            useGetTarget: hookGetTarget[target],
        }}
      >
        {children}
      </CollaboratorProduct.Provider>
    );
  }
  
  const useCollaboratorProductStore = (): GlobalCollaboratorProduct => useContext(CollaboratorProduct);
  
  export default useCollaboratorProductStore;
  