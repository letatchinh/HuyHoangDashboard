import {
    createContext,
    ReactNode, useContext
} from "react";
import { useParams } from "react-router-dom";
import { useGetBill } from "../bill.hook";
export type GlobalUpdateBill = {
    bill : any,
    isLoading : boolean,
};
const UpdateBill = createContext<GlobalUpdateBill>({
    bill : null,
    isLoading : false
});

type UpdateBillProviderProps = {
  children: ReactNode;

};

export function UpdateBillProvider({
  children,

}: UpdateBillProviderProps): JSX.Element {
    const { id } = useParams();
  const [bill,isLoading] = useGetBill(id);
  return (
    <UpdateBill.Provider
      value={{
        bill,
        isLoading,
      }}
    >
      {children}
    </UpdateBill.Provider>
  );
}

const useUpdateBillStore = (): GlobalUpdateBill => useContext(UpdateBill);

export default useUpdateBillStore;
