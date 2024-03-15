import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useUpdateSalesGroup } from "./salesGroup.hook";
export type GlobalSalesGroup = {
  isSubmitLoading: boolean;
  updateSalesGroup: (p: any) => void;
  onOpenFormCreateGroupFromExistGroup: (p:any) => void;
  onOpenForm: (p?:any) => void;
  onCloseForm: () => void;
  onOpenFormRelation: (p?:any) => void;
  onCloseFormRelation: () => void;
  id?: any;
  parentNear?: any;
  isOpenForm: boolean;
  isOpenFormRelation: boolean;
};
const SalesGroup = createContext<GlobalSalesGroup>({
  isSubmitLoading: false,
  updateSalesGroup: () => {},
  onOpenFormCreateGroupFromExistGroup: () => {},
  onOpenForm: () => {},
  onCloseForm: () => {},
  onOpenFormRelation: () => {},
  onCloseFormRelation: () => {},
  id: null,
  parentNear: null,
  isOpenForm: false,
  isOpenFormRelation: false,
});

type SalesGroupProviderProps = {
  children: ReactNode;
};

export function SalesGroupProvider({
  children,
}: SalesGroupProviderProps): JSX.Element {
  const [isOpenFormRelation, setIsOpenFormRelation]: any = useState(false);
  const [id, setId]: any = useState();
  const [parentNear, setParentNear]: any = useState();
  const [isOpenForm, setIsOpenForm]: any = useState(false);

  // Control form
  const onOpenForm = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenForm(true);
  }, []);
  const onOpenFormCreateGroupFromExistGroup = useCallback((data?: any) => {
    setParentNear(data);
    setIsOpenForm(true);
  }, []);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
    setParentNear(null);
  }, []);

  const onOpenFormRelation = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenFormRelation(true);
  }, []);
  const onCloseFormRelation = useCallback(() => {
    setIsOpenFormRelation(false);
    setId(null);
  }, []);
  const [isSubmitLoading, updateSalesGroup] = useUpdateSalesGroup(onCloseForm);
  return (
    <SalesGroup.Provider
      value={{
        isSubmitLoading,
        updateSalesGroup,
        onOpenForm,
        onOpenFormCreateGroupFromExistGroup,
        onCloseForm,
        id,
        parentNear,
        isOpenForm,
        isOpenFormRelation,
        onOpenFormRelation,
        onCloseFormRelation,
      }}
    >
      {children}
    </SalesGroup.Provider>
  );
}

const useSalesGroupStore = (): GlobalSalesGroup => useContext(SalesGroup);

export default useSalesGroupStore;
