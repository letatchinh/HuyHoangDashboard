import {
    createContext,
    ReactNode, useCallback, useContext, useMemo, useState
} from "react";
import { useParams } from "react-router-dom";
import { useGetBill } from "../bill.hook";
export type GlobalUpdateBill = {
    bill : any,
    isLoading : boolean,
    mutateBill : () => void
};
const UpdateBill = createContext<GlobalUpdateBill>({
    bill : null,
    isLoading : false,
    mutateBill : () => {}
});

type UpdateBillProviderProps = {
  children: ReactNode;

};

export function UpdateBillProvider({
  children,

}: UpdateBillProviderProps): JSX.Element {
    const { id } = useParams();
    const [reFetch,setReFetch] = useState(false);
    const mutateBill = useCallback(() => setReFetch(!reFetch),[reFetch]);
    const [bill,isLoading] = useGetBill(id,reFetch);
  return (
    <UpdateBill.Provider
      value={{
        bill,
        isLoading,
        mutateBill,
      }}
    >
      {children}
    </UpdateBill.Provider>
  );
}

const useUpdateBillStore = (): GlobalUpdateBill => useContext(UpdateBill);

export default useUpdateBillStore;
