import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useDeleteSalesGroup, useUpdateSalesGroup } from "./salesGroup.hook";
export type GlobalSalesGroup = {
  isSubmitLoading: boolean;
  updateSalesGroup: (p: any) => void;
  deleteSalesGroup: (p: any) => void;
  onOpenFormCreateGroupFromExistGroup: (p:any) => void;
  onOpenForm: (p?:any) => void;
  onCloseForm: () => void;
  onOpenFormRelation: (p?:any) => void;
  onCloseFormRelation: () => void;
  id?: any;
  parentNear?: any;
  isOpenForm: boolean;
  isOpenFormRelation: boolean;
  isOpenFormExchangeRate: boolean;
  onCloseFormExchangeRate: () => void;
  onOpenFormExchangeRate: (value?: any) => void;
  setParentNear: any;
  groupInfo: any,
  setGroupInfo: any
};
const SalesGroup = createContext<GlobalSalesGroup>({
  isSubmitLoading: false,
  updateSalesGroup: () => {},
  deleteSalesGroup: () => {},
  onOpenFormCreateGroupFromExistGroup: () => {},
  onOpenForm: () => {},
  onCloseForm: () => {},
  onOpenFormRelation: () => {},
  onCloseFormRelation: () => {},
  id: null,
  parentNear: null,
  isOpenForm: false,
  isOpenFormRelation: false,
  isOpenFormExchangeRate: false,
  onCloseFormExchangeRate: () => { },
  onOpenFormExchangeRate: () => { },
  setParentNear: () => { },
  groupInfo: null,
  setGroupInfo: () => { },
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
  const [isOpenFormExchangeRate, setIsOpenFormExchangeRate]: any = useState(false);
  const [groupInfo, setGroupInfo]: any = useState();

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

  const onOpenFormExchangeRate = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenFormExchangeRate(true);
  }, []);

  const onCloseFormExchangeRate = useCallback(() => {
    setIsOpenFormExchangeRate(false);
    setId(null);
    setParentNear(null);
  }, []);

  const [isSubmitLoading, updateSalesGroup] = useUpdateSalesGroup(onCloseForm);
  const [, deleteSalesGroup]: any = useDeleteSalesGroup();

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
        deleteSalesGroup,
        isOpenFormExchangeRate,
        onOpenFormExchangeRate,
        onCloseFormExchangeRate,
        setParentNear,
        groupInfo,
        setGroupInfo
      }}
    >
      {children}
    </SalesGroup.Provider>
  );
}

const useSalesGroupStore = (): GlobalSalesGroup => useContext(SalesGroup);

export default useSalesGroupStore;
