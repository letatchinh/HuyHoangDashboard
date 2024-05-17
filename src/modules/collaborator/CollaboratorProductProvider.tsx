import {
    createContext,
    ReactNode, useContext, useMemo
} from "react";
import { useFetchState } from "~/utils/helpers";
import { useGetRole } from "../auth/auth.hook";
import apis from "./collaborator.api";
  export type GlobalCollaboratorProduct = {
    canAdd : boolean,
    canUpdate : boolean,
    canDelete : boolean,
  };
  const CollaboratorProduct = createContext<GlobalCollaboratorProduct>({
    canAdd : false,
    canUpdate : false,
    canDelete : false,
  });
  
  type CollaboratorProductProviderProps = {
    children: ReactNode;
    id : string;
    target : 'employee' | 'partner'
  };
  
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
        }}
      >
        {children}
      </CollaboratorProduct.Provider>
    );
  }
  
  const useCollaboratorProductStore = (): GlobalCollaboratorProduct => useContext(CollaboratorProduct);
  
  export default useCollaboratorProductStore;
  