import {
    createContext,
    ReactNode, useContext
} from "react";
import { useUpdateSalesGroup } from "./salesGroup.hook";
export type GlobalSalesGroup = {
    isSubmitLoading : boolean;
    updateSalesGroup : (p:any) => void;
};
const SalesGroup = createContext<GlobalSalesGroup>({
    isSubmitLoading : false,
    updateSalesGroup : () => {}
});

type SalesGroupProviderProps = {
  children: ReactNode;

};

export function SalesGroupProvider({
  children,

}: SalesGroupProviderProps): JSX.Element {
const [isSubmitLoading,updateSalesGroup] = useUpdateSalesGroup();
  return (
    <SalesGroup.Provider
      value={{
        isSubmitLoading,
        updateSalesGroup,
      }}
    >
      {children}
    </SalesGroup.Provider>
  );
}

const useSalesGroupStore = (): GlobalSalesGroup => useContext(SalesGroup);

export default useSalesGroupStore;
